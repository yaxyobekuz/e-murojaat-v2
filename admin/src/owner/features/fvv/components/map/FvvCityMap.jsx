// FVV operativ shahar xaritasi — izometrik (qiya 3D) ko'rinish. Organik egri ko'chalar,
// daryo, 3D kvartal bloklari, honadon pinlari. Yong'in mashinasi ("Pajar", 3D) yo'l
// bo'ylab doimiy harakatda (sekin, demo). ETA/rasch/suv — onMission/onEta orqali.
import { useEffect, useMemo, useRef, useState } from "react";

import {
  WORLD,
  RIVER,
  ROUTE_CTRL,
  SIDE_ROADS,
  HOUSEHOLDS,
  MISSIONS,
  MISSION_KIND,
  FIRE_STATION,
  RISK_TONE,
  getHousehold,
} from "../../mock/fvv.cityMap";

const SPEED = 36; // world px/sekund — sekin harakat
const ARRIVE_DIST = 26;

// ── Izometrik proyeksiya (tekis reja -> qiya ko'rinish) ────────────────────────
const TH = -0.36; // burchak (rad)
const COS = Math.cos(TH);
const SIN = Math.sin(TH);
const SY = 0.62; // vertikal qisqarish (perspektiva tuyg'usi)
const CX = WORLD.w / 2;
const CY = WORLD.h / 2;
const project = (x, y) => {
  const dx = x - CX;
  const dy = y - CY;
  return [dx * COS - dy * SIN, (dx * SIN + dy * COS) * SY];
};

// ── Catmull-Rom silliqlash ─────────────────────────────────────────────────────
const cr = (p0, p1, p2, p3, t) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return [
    0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
    0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
  ];
};
const densifyClosed = (P, per = 16) => {
  const n = P.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n];
    const p1 = P[i];
    const p2 = P[(i + 1) % n];
    const p3 = P[(i + 2) % n];
    for (let k = 0; k < per; k++) out.push(cr(p0, p1, p2, p3, k / per));
  }
  out.push(out[0]);
  return out;
};
const densifyOpen = (P, per = 14) => {
  const n = P.length;
  const out = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = P[Math.max(i - 1, 0)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(i + 2, n - 1)];
    for (let k = 0; k < per; k++) out.push(cr(p0, p1, p2, p3, k / per));
  }
  out.push(P[n - 1]);
  return out;
};

const pathD = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

// deterministik rng
const rng = (s) => {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const FvvCityMap = ({ activeHouseId, onSelectHouse, onMission, onEta }) => {
  const truckRef = useRef(null);
  const rafRef = useRef(0);
  const distRef = useRef(0);
  const lastRef = useRef(0);
  const lastMissionRef = useRef(-1);
  const lastEtaRef = useRef(-1);
  const [missionIdx, setMissionIdx] = useState(0);
  const [arrived, setArrived] = useState(false);

  // World geometriya (route, yo'llar, daryo, bloklar)
  const geom = useMemo(() => {
    const routeW = densifyClosed(ROUTE_CTRL, 16); // world dense
    const segs = [];
    const cum = [0];
    let total = 0;
    for (let i = 0; i < routeW.length - 1; i++) {
      const a = routeW[i];
      const b = routeW[i + 1];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      segs.push({ a, b, len });
      total += len;
      cum.push(total);
    }
    const routeS = routeW.map(([x, y]) => project(x, y));
    const sideS = SIDE_ROADS.map((r) => densifyOpen(r.pts).map(([x, y]) => project(x, y)));
    const riverS = densifyOpen(RIVER.pts).map(([x, y]) => project(x, y));

    // 3D bloklar — daryo yo'lagidan tashqarida tarqalgan
    const blocks = [];
    for (let i = 0; i < 120; i++) {
      const x = 40 + rng(i * 1.7) * 920;
      const y = 30 + rng(i * 2.3 + 5) * 660;
      // daryoga yaqin bo'lsa o'tkaz
      const rx = 330 + (y / 720) * 120;
      if (Math.abs(x - rx) < 70) continue;
      const w = 30 + rng(i * 3.1) * 34;
      const h = 26 + rng(i * 4.7) * 30;
      const ht = 8 + rng(i * 5.9) * 16; // balandlik (3D)
      blocks.push({ x, y, w, h, ht, t: rng(i * 6.3) });
    }
    return { routeW, segs, cum, total, routeS, sideS, riverS, blocks };
  }, []);

  // Missiya manzillari -> route bo'ylab masofa (tartiblash uchun)
  const missions = useMemo(() => {
    const nearestDist = (pos) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < geom.routeW.length - 1; i++) {
        const d = Math.hypot(geom.routeW[i][0] - pos.x, geom.routeW[i][1] - pos.y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return geom.cum[best];
    };
    return MISSIONS.map((m) => ({ ...m, dist: nearestDist(getHousehold(m.householdId).pos) })).sort(
      (a, b) => a.dist - b.dist,
    );
  }, [geom]);

  // viewBox — proyeksiya chegaralari + padding (pin/bino tepasi uchun yuqorida ko'proq)
  const view = useMemo(() => {
    const pts = [
      ...geom.routeS,
      ...geom.sideS.flat(),
      ...geom.riverS,
      ...geom.blocks.flatMap((b) => [project(b.x, b.y), project(b.x + b.w, b.y + b.h)]),
      ...HOUSEHOLDS.map((h) => project(h.pos.x, h.pos.y)),
      project(FIRE_STATION.x, FIRE_STATION.y),
    ];
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs) - 40;
    const maxX = Math.max(...xs) + 40;
    const minY = Math.min(...ys) - 80;
    const maxY = Math.max(...ys) + 50;
    return { minX, minY, w: maxX - minX, h: maxY - minY };
  }, [geom]);

  const worldAt = (d) => {
    const { segs, cum, total } = geom;
    const dist = ((d % total) + total) % total;
    for (let i = 0; i < segs.length; i++) {
      if (dist <= cum[i + 1] || i === segs.length - 1) {
        const s = segs[i];
        const t = s.len === 0 ? 0 : (dist - cum[i]) / s.len;
        return [s.a[0] + (s.b[0] - s.a[0]) * t, s.a[1] + (s.b[1] - s.a[1]) * t];
      }
    }
    return geom.routeW[0];
  };

  useEffect(() => {
    const step = (ts) => {
      if (!lastRef.current) lastRef.current = ts;
      const dt = Math.min(0.05, (ts - lastRef.current) / 1000);
      lastRef.current = ts;
      distRef.current = (distRef.current + SPEED * dt) % geom.total;
      const d = distRef.current;

      const [wx, wy] = worldAt(d);
      const [ax, ay] = worldAt(d + 3);
      const [sx, sy] = project(wx, wy);
      const [asx, asy] = project(ax, ay);
      const angle = (Math.atan2(asy - sy, asx - sx) * 180) / Math.PI;
      if (truckRef.current) truckRef.current.setAttribute("transform", `translate(${sx} ${sy}) rotate(${angle})`);

      let idx = missions.findIndex((m) => m.dist > d + 0.5);
      if (idx === -1) idx = 0;
      if (idx !== lastMissionRef.current) {
        lastMissionRef.current = idx;
        setMissionIdx(idx);
        onMission?.(missions[idx]);
      }
      const targetD = missions[idx].dist;
      const remaining = (((targetD - d) % geom.total) + geom.total) % geom.total;
      const etaSec = Math.round(remaining / SPEED);
      if (etaSec !== lastEtaRef.current) {
        lastEtaRef.current = etaSec;
        onEta?.(etaSec);
      }
      setArrived(remaining < ARRIVE_DIST || geom.total - remaining < ARRIVE_DIST);

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geom, missions]);

  const mission = missions[missionIdx];
  const target = getHousehold(mission?.householdId);
  const kind = MISSION_KIND[mission?.kind] || MISSION_KIND.check;

  // 3D blok chizish
  const renderBlock = (b, i) => {
    const base = [
      project(b.x, b.y),
      project(b.x + b.w, b.y),
      project(b.x + b.w, b.y + b.h),
      project(b.x, b.y + b.h),
    ];
    const top = base.map(([x, y]) => [x, y - b.ht]);
    const topFill = b.t > 0.78 ? "#9fd0ec" : "#c4def0";
    const quad = (p) => p.map((q) => q.join(",")).join(" ");
    return (
      <g key={`bl-${i}`}>
        {/* yon yuzalar */}
        {[0, 1, 2, 3].map((e) => {
          const j = (e + 1) % 4;
          return (
            <polygon
              key={e}
              points={quad([base[e], base[j], top[j], top[e]])}
              fill="#7fb0d4"
              opacity="0.7"
            />
          );
        })}
        {/* tom */}
        <polygon points={quad(top)} fill={topFill} stroke="#ffffff" strokeOpacity="0.45" strokeWidth="0.6" />
      </g>
    );
  };

  const station = project(FIRE_STATION.x, FIRE_STATION.y);

  // Pin chizish (tikka turadi)
  const renderPin = (h) => {
    const [bx, by] = project(h.pos.x, h.pos.y);
    const isTarget = mission?.householdId === h.id;
    const isActive = activeHouseId === h.id;
    const col = isTarget ? kind.color : "#2f7fd6";
    const r = isTarget ? 13 : 11;
    const ph = isTarget ? 34 : 28;
    const cy = by - ph;
    return (
      <g key={h.id} className="cursor-pointer" onClick={() => onSelectHouse(h.id)}>
        {isTarget && (
          <ellipse cx={bx} cy={by} rx="16" ry="6" fill={kind.color} opacity="0.3">
            <animate attributeName="rx" values="10;22;10" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0;0.45" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
        )}
        <ellipse cx={bx} cy={by} rx="7" ry="2.6" fill="#0b3a63" opacity="0.35" />
        {/* oyoq */}
        <path d={`M${bx - r * 0.5},${cy + r * 0.4} L${bx},${by - 1} L${bx + r * 0.5},${cy + r * 0.4} Z`} fill={col} />
        {/* bosh */}
        <circle cx={bx} cy={cy} r={r} fill={col} stroke="#fff" strokeWidth={isActive ? 3 : 1.6} />
        <circle cx={bx} cy={cy} r={r * 0.42} fill="#fff" />
        <text x={bx} y={by + 13} textAnchor="middle" className="pointer-events-none fill-slate-700 text-[9px] font-medium">
          {h.residents} kishi
        </text>
      </g>
    );
  };

  return (
    <svg viewBox={`${view.minX} ${view.minY} ${view.w} ${view.h}`} className="h-full w-full">
      <defs>
        <linearGradient id="fvv-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbe9f4" />
          <stop offset="100%" stopColor="#c2d8e8" />
        </linearGradient>
        <linearGradient id="fvv-river" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6fb0db" />
          <stop offset="100%" stopColor="#4f97c9" />
        </linearGradient>
        <filter id="fvv-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* yer foni */}
      <rect x={view.minX} y={view.minY} width={view.w} height={view.h} fill="url(#fvv-ground)" />

      {/* daryo */}
      <path d={pathD(geom.riverS)} fill="none" stroke="#bfe0f2" strokeWidth={RIVER.width * SY + 8} strokeLinecap="round" opacity="0.6" />
      <path d={pathD(geom.riverS)} fill="none" stroke="url(#fvv-river)" strokeWidth={RIVER.width * SY} strokeLinecap="round" />

      {/* qo'shimcha ko'chalar */}
      {geom.sideS.map((pts, i) => (
        <g key={`sr-${i}`}>
          <path d={pathD(pts)} fill="none" stroke="#aac6dc" strokeWidth="13" strokeLinecap="round" />
          <path d={pathD(pts)} fill="none" stroke="#f4f9fd" strokeWidth="8" strokeLinecap="round" />
        </g>
      ))}

      {/* 3D bloklar */}
      {geom.blocks.map(renderBlock)}

      {/* ASOSIY yo'l (Pajar marshruti) */}
      <path d={pathD(geom.routeS)} fill="none" stroke="#9cbdd8" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathD(geom.routeS)} fill="none" stroke="#ffffff" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathD(geom.routeS)} fill="none" stroke="#cfe0ee" strokeWidth="1.5" strokeDasharray="8 12" strokeLinecap="round" />

      {/* yong'in deposi */}
      <g>
        <ellipse cx={station[0]} cy={station[1]} rx="9" ry="3.2" fill="#0b3a63" opacity="0.3" />
        <rect x={station[0] - 13} y={station[1] - 24} width="26" height="24" rx="4" fill="#dc2626" stroke="#fff" strokeWidth="1.4" />
        <text x={station[0]} y={station[1] - 8} textAnchor="middle" className="fill-white text-[12px] font-bold">13</text>
      </g>

      {/* honadon pinlari */}
      {HOUSEHOLDS.map(renderPin)}

      {/* ── Pajar (3D yong'in mashinasi) ── */}
      <g ref={truckRef}>
        {/* soya */}
        <ellipse cx="0" cy="7" rx="20" ry="6" fill="#0b3a63" opacity="0.28" />
        {/* shassi/yon yuzasi (3D pastki) */}
        <polygon points="-17,3 11,3 11,8 -17,8" fill="#7f1d1d" />
        <polygon points="11,3 16,0 16,5 11,8" fill="#991b1b" />
        {/* korpus tepa */}
        <polygon points="-17,-6 11,-6 16,-9 -12,-9" fill="#f87171" />
        <rect x="-17" y="-6" width="28" height="9" rx="1.5" fill="#dc2626" stroke="#fff" strokeWidth="0.7" />
        {/* kabina */}
        <rect x="4" y="-5" width="9" height="8" rx="1.5" fill="#b91c1c" stroke="#fff" strokeWidth="0.5" />
        <rect x="7" y="-3.5" width="4.5" height="3.2" rx="0.8" fill="#cfeefe" />
        {/* nardbon */}
        <rect x="-15" y="-4" width="22" height="2" rx="1" fill="#cbd5e1" />
        <rect x="-15" y="-4" width="22" height="2" rx="1" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
        {/* g'ildiraklar */}
        <ellipse cx="-9" cy="8" rx="3" ry="2.2" fill="#111" />
        <ellipse cx="6" cy="8" rx="3" ry="2.2" fill="#111" />
        {/* mayoq */}
        <rect x="-3" y="-11" width="6" height="2.5" rx="1" fill="#3b82f6">
          <animate attributeName="fill" values="#3b82f6;#ef4444;#3b82f6" dur="0.5s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* manzilga yetganda yorliq */}
      {arrived && target && (() => {
        const [tx, ty] = project(target.pos.x, target.pos.y);
        return (
          <g>
            <rect x={tx - 62} y={ty - 78} width="124" height="20" rx="6" fill="#0a2540" stroke={kind.color} strokeWidth="1.2" opacity="0.95" />
            <text x={tx} y={ty - 64} textAnchor="middle" className="fill-white text-[10px] font-semibold">
              {kind.label} — hodisa joyida
            </text>
          </g>
        );
      })()}
    </svg>
  );
};

export default FvvCityMap;
