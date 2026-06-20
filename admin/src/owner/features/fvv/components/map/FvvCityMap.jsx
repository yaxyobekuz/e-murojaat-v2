// FVV operativ shahar xaritasi — murakkab ko'cha to'ri chiziladi, yong'in mashinasi
// ("Pajar") doimiy harakatda (demo, sekin). Marshrutdagi keyingi manzil = joriy missiya.
// Honadon bosilsa — onSelectHouse(id). ETA (yetib borish vaqti) onEta orqali chiqadi.
import { useEffect, useMemo, useRef, useState } from "react";

import {
  VIEW,
  ROADS,
  ROUTE,
  HOUSEHOLDS,
  MISSIONS,
  MISSION_KIND,
  FIRE_STATION,
  RISK_TONE,
  getHousehold,
} from "../../mock/fvv.cityMap";

const SPEED = 34; // px/sekund — mashina tezligi (sekin, kuzatish uchun qulay)
const ARRIVE_DIST = 22; // manzilga "yetdi" deb hisoblanadigan masofa

const XS = [120, 300, 500, 700, 880];
const YS = [90, 230, 400, 560];

// Marshrut segmentlari + kumulyativ uzunlik
const buildGeometry = () => {
  const segs = [];
  const cum = [0];
  let total = 0;
  for (let i = 0; i < ROUTE.length - 1; i++) {
    const a = ROUTE[i];
    const b = ROUTE[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len });
    total += len;
    cum.push(total);
  }
  return { segs, cum, total };
};

const sampleRoute = (geom, d) => {
  const { segs, cum } = geom;
  const dist = ((d % geom.total) + geom.total) % geom.total;
  for (let i = 0; i < segs.length; i++) {
    if (dist <= cum[i + 1] || i === segs.length - 1) {
      const s = segs[i];
      const t = s.len === 0 ? 0 : (dist - cum[i]) / s.len;
      return {
        x: s.a[0] + (s.b[0] - s.a[0]) * t,
        y: s.a[1] + (s.b[1] - s.a[1]) * t,
        angle: (Math.atan2(s.b[1] - s.a[1], s.b[0] - s.a[0]) * 180) / Math.PI,
      };
    }
  }
  return { x: ROUTE[0][0], y: ROUTE[0][1], angle: 0 };
};

const FvvCityMap = ({ activeHouseId, onSelectHouse, onMission, onEta }) => {
  const geom = useMemo(buildGeometry, []);
  const truckRef = useRef(null);
  const rafRef = useRef(0);
  const distRef = useRef(0);
  const lastRef = useRef(0);
  const lastMissionRef = useRef(-1);
  const lastEtaRef = useRef(-1);
  const [missionIdx, setMissionIdx] = useState(0);
  const [arrived, setArrived] = useState(false);

  const missionDist = useMemo(() => MISSIONS.map((m) => geom.cum[m.routeIndex]), [geom]);

  useEffect(() => {
    const step = (ts) => {
      if (!lastRef.current) lastRef.current = ts;
      const dt = Math.min(0.05, (ts - lastRef.current) / 1000);
      lastRef.current = ts;
      distRef.current = (distRef.current + SPEED * dt) % geom.total;
      const d = distRef.current;

      const { x, y, angle } = sampleRoute(geom, d);
      if (truckRef.current) {
        truckRef.current.setAttribute("transform", `translate(${x} ${y}) rotate(${angle})`);
      }

      // Joriy missiya = oldinda turgan eng yaqin manzil
      let idx = missionDist.findIndex((md) => md > d + 0.5);
      if (idx === -1) idx = 0;
      if (idx !== lastMissionRef.current) {
        lastMissionRef.current = idx;
        setMissionIdx(idx);
        onMission?.(MISSIONS[idx]);
      }

      // Yetib borish masofasi/vaqti
      const targetD = missionDist[idx];
      const remaining = ((targetD - d) % geom.total + geom.total) % geom.total;
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
  }, [geom]);

  const mission = MISSIONS[missionIdx];
  const target = getHousehold(mission?.householdId);
  const kind = MISSION_KIND[mission?.kind] || MISSION_KIND.check;

  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-full w-full">
      <defs>
        <radialGradient id="fvv-bg" cx="35%" cy="25%" r="90%">
          <stop offset="0%" stopColor="#121a2e" />
          <stop offset="100%" stopColor="#0a0e1a" />
        </radialGradient>
        <filter id="fvv-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width={VIEW.w} height={VIEW.h} fill="url(#fvv-bg)" />

      {/* kvartal bloklari (to'r kataklari) */}
      {XS.slice(0, -1).map((x0, ci) =>
        YS.slice(0, -1).map((y0, ri) => {
          const isPark = ci === 1 && ri === 2;
          return (
            <rect
              key={`b-${ci}-${ri}`}
              x={x0 + 20}
              y={y0 + 18}
              width={XS[ci + 1] - x0 - 40}
              height={YS[ri + 1] - y0 - 36}
              rx="6"
              fill={isPark ? "#0f2a1c" : "#16203a"}
              stroke={isPark ? "#1c4733" : "#1f2c4a"}
              strokeWidth="1"
              opacity="0.72"
            />
          );
        }),
      )}
      <text x="400" y="490" textAnchor="middle" className="fill-emerald-300/40 text-[12px]">Bog'</text>

      {/* ko'chalar — casing + fill + markaziy chiziq */}
      {ROADS.map((r) => {
        const d = r.pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
        const minor = r.id.startsWith("d");
        return (
          <g key={r.id}>
            <path d={d} fill="none" stroke="#0c1322" strokeWidth={minor ? 14 : 22} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#243248" strokeWidth={minor ? 9 : 16} strokeLinecap="round" />
            {!minor && (
              <path d={d} fill="none" stroke="#4a5d7e" strokeWidth="1.5" strokeDasharray="10 12" opacity="0.6" />
            )}
          </g>
        );
      })}

      {/* mashina marshruti (joriy maqsad rangida, yengil) */}
      <path
        d={ROUTE.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ")}
        fill="none"
        stroke={kind.color}
        strokeWidth="2.5"
        strokeDasharray="2 10"
        opacity="0.4"
      />

      {/* honadonlar */}
      {HOUSEHOLDS.map((h) => {
        const isActive = activeHouseId === h.id;
        const isTarget = mission?.householdId === h.id;
        const rc = RISK_TONE[h.risk]?.color || "#22c55e";
        return (
          <g key={h.id} className="cursor-pointer" onClick={() => onSelectHouse(h.id)}>
            {isTarget && (
              <circle cx={h.pos.x} cy={h.pos.y} r="14" fill="none" stroke={kind.color} strokeWidth="2">
                <animate attributeName="r" values="12;26;12" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0;0.9" dur="1.4s" repeatCount="indefinite" />
              </circle>
            )}
            <rect
              x={h.pos.x - 9}
              y={h.pos.y - 9}
              width="18"
              height="18"
              rx="4"
              fill={isTarget ? kind.color : "#1b2740"}
              stroke={isActive ? "#fff" : rc}
              strokeWidth={isActive ? 2.5 : 1.6}
            />
            <path
              d={`M${h.pos.x - 5},${h.pos.y + 1} L${h.pos.x},${h.pos.y - 4} L${h.pos.x + 5},${h.pos.y + 1}`}
              fill="none"
              stroke="#fff"
              strokeWidth="1.4"
              opacity="0.9"
            />
            <rect x={h.pos.x - 3.5} y={h.pos.y + 1} width="7" height="5" fill="#fff" opacity="0.85" />
            <text
              x={h.pos.x}
              y={h.pos.y + 26}
              textAnchor="middle"
              className="pointer-events-none fill-white/70 text-[9px]"
            >
              {h.residents} kishi
            </text>
          </g>
        );
      })}

      {/* yong'in deposi */}
      <g>
        <rect x={FIRE_STATION.x - 12} y={FIRE_STATION.y - 12} width="24" height="24" rx="5" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
        <text x={FIRE_STATION.x} y={FIRE_STATION.y + 4} textAnchor="middle" className="fill-white text-[12px] font-bold">13</text>
        <text x={FIRE_STATION.x} y={FIRE_STATION.y + 28} textAnchor="middle" className="fill-rose-300/70 text-[9px]">Yong'in qism</text>
      </g>

      {/* ── Yong'in mashinasi (Pajar) — harakatda ── */}
      <g ref={truckRef}>
        <ellipse cx="0" cy="0" rx="22" ry="9" fill={kind.color} opacity="0.18" filter="url(#fvv-glow)" />
        <rect x="-16" y="-7" width="26" height="14" rx="2.5" fill="#dc2626" stroke="#fff" strokeWidth="0.8" />
        <rect x="6" y="-6" width="9" height="12" rx="2" fill="#b91c1c" stroke="#fff" strokeWidth="0.6" />
        <rect x="9" y="-4.5" width="4.5" height="4" rx="1" fill="#bae6fd" />
        <rect x="-14" y="-2" width="20" height="2" rx="1" fill="#9ca3af" />
        <circle cx="-9" cy="8" r="2.6" fill="#111" />
        <circle cx="6" cy="8" r="2.6" fill="#111" />
        <circle cx="-2" cy="-9" r="2.4" fill="#3b82f6">
          <animate attributeName="fill" values="#3b82f6;#ef4444;#3b82f6" dur="0.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* manzilga yetganda yorliq */}
      {arrived && target && (
        <g>
          <rect x={target.pos.x - 62} y={target.pos.y - 52} width="124" height="22" rx="6" fill="#0a0e1a" stroke={kind.color} strokeWidth="1.2" opacity="0.95" />
          <text x={target.pos.x} y={target.pos.y - 37} textAnchor="middle" className="fill-white text-[10px] font-semibold">
            {kind.label} — hodisa joyida
          </text>
        </g>
      )}
    </svg>
  );
};

export default FvvCityMap;
