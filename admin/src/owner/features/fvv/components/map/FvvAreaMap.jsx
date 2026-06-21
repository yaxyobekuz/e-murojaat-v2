// FVV xaritasi — IIB voronoi blok SHAKLI + bloklar ustida honadon/bino markerlari.
// Yo'llar BLOK CHEGARALARIDAN olinadi (grafga aylantiriladi) — kartaga aniq mos keladi.
// Yong'in mashinasi shu graf bo'ylab REAL tezlikda (km/soat) yuradi; holat mashinasi:
// PATROL → EN_ROUTE → EXTINGUISHING → RETURNING. Holat/ETA onStatus orqali chiqadi.
import { useEffect, useMemo, useRef, useState } from "react";

import {
  MAHALLA_AREAS,
  HOUSEHOLDS,
  OBJECT_TYPES,
  DEPOT,
  FIRE_STATUS,
  metersBetween,
} from "../../mock/fvv.mapAreas";

const PAD = 28;
const W = 760;
const H = 440;
const TRUCK_KMH = 45; // real tezlik
const MPS = (TRUCK_KMH * 1000) / 3600;
const EXT_TIME = 4; // o'chirish (soniya)

const qkey = (lat, lng) => `${Math.round(lat * 1e5)}_${Math.round(lng * 1e5)}`;

const FvvAreaMap = ({ statusFilter = [], active, onSelect, onSelectHouse, onStatus }) => {
  // Proyeksiya (lat/lng -> ekran)
  const project = useMemo(() => {
    const pts = MAHALLA_AREAS.flatMap((a) => a.path);
    const lats = pts.map((p) => p.lat);
    const lngs = pts.map((p) => p.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const sx = (W - PAD * 2) / (maxLng - minLng || 1);
    const sy = (H - PAD * 2) / (maxLat - minLat || 1);
    return ({ lat, lng }) => ({ x: PAD + (lng - minLng) * sx, y: PAD + (maxLat - lat) * sy });
  }, []);

  // Yo'l grafi — blok chegaralaridan (umumiy qirralar = ko'chalar)
  const graph = useMemo(() => {
    const nodes = new Map(); // key -> {key, lat, lng, nbrs:Set}
    const add = (lat, lng) => {
      const k = qkey(lat, lng);
      if (!nodes.has(k)) nodes.set(k, { key: k, lat, lng, nbrs: new Set() });
      return k;
    };
    const edgeSet = new Set();
    for (const a of MAHALLA_AREAS) {
      const n = a.path.length;
      for (let i = 0; i < n; i++) {
        const p = a.path[i];
        const q = a.path[(i + 1) % n];
        const kp = add(p.lat, p.lng);
        const kq = add(q.lat, q.lng);
        if (kp === kq) continue;
        nodes.get(kp).nbrs.add(kq);
        nodes.get(kq).nbrs.add(kp);
        const ek = kp < kq ? `${kp}|${kq}` : `${kq}|${kp}`;
        edgeSet.add(ek);
      }
    }
    const edges = [...edgeSet].map((ek) => {
      const [a, b] = ek.split("|");
      return [nodes.get(a), nodes.get(b)];
    });
    const nearestKey = (lat, lng) => {
      let best = null, bd = Infinity;
      for (const nd of nodes.values()) {
        const d = metersBetween({ lat, lng }, nd);
        if (d < bd) { bd = d; best = nd.key; }
      }
      return best;
    };
    const bfs = (start, goal) => {
      if (start === goal) return [start];
      const q = [start];
      const prev = { [start]: null };
      while (q.length) {
        const cur = q.shift();
        if (cur === goal) break;
        for (const nb of nodes.get(cur).nbrs) {
          if (!(nb in prev)) { prev[nb] = cur; q.push(nb); }
        }
      }
      if (!(goal in prev)) return [start];
      const path = [];
      let c = goal;
      while (c) { path.unshift(c); c = prev[c]; }
      return path;
    };
    return { nodes, edges, nearestKey, bfs };
  }, []);

  // Binolar (bezak) — har blok markazi atrofida kichik footprintlar
  const buildings = useMemo(() => {
    const rng = (s) => { const x = Math.sin(s * 91.7 + 13.1) * 43758.5; return x - Math.floor(x); };
    const out = [];
    MAHALLA_AREAS.forEach((a, ai) => {
      const c = project(a.center);
      const n = 3 + Math.floor(rng(ai) * 3);
      for (let i = 0; i < n; i++) {
        const ang = rng(ai * 7 + i) * Math.PI * 2;
        const r = 14 + rng(ai * 3 + i) * 20;
        out.push({
          x: c.x + Math.cos(ang) * r,
          y: c.y + Math.sin(ang) * r * 0.7,
          w: 7 + rng(ai + i * 2) * 7,
          h: 6 + rng(ai * 2 + i) * 6,
        });
      }
    });
    return out;
  }, [project]);

  // ── Simulyatsiya ──
  const truckRef = useRef(null);
  const beaconRef = useRef(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const hudRef = useRef(0);
  const sim = useRef(null);
  const [activeFires, setActiveFires] = useState(() => new Set(MAHALLA_AREAS.filter((a) => a.status === "fire").map((a) => a.id)));
  const firesRef = useRef(activeFires);
  useEffect(() => { firesRef.current = activeFires; }, [activeFires]);

  // sim init
  if (!sim.current) {
    const depotKey = graph.nearestKey(DEPOT.lat, DEPOT.lng);
    const nd = graph.nodes.get(depotKey);
    sim.current = {
      cur: depotKey, depotKey,
      pos: { lat: nd.lat, lng: nd.lng },
      path: [], state: "PATROL", target: null, ext: 0, fireTimer: 18, angle: 0,
    };
  }

  const blockById = useMemo(() => Object.fromEntries(MAHALLA_AREAS.map((a) => [a.id, a])), []);

  const ignite = (id) => {
    if (firesRef.current.has(id)) return;
    const next = new Set(firesRef.current); next.add(id);
    firesRef.current = next; setActiveFires(next);
  };
  const extinguish = (id) => {
    const next = new Set(firesRef.current); next.delete(id);
    firesRef.current = next; setActiveFires(next);
  };

  const nearestFireBlock = (S) => {
    let best = null, bd = Infinity;
    for (const id of firesRef.current) {
      const b = blockById[id];
      const d = metersBetween(S.pos, b.center);
      if (d < bd) { bd = d; best = id; }
    }
    return best;
  };
  const routeToBlock = (S, id) => {
    const b = blockById[id];
    const goal = graph.nearestKey(b.center.lat, b.center.lng);
    const p = graph.bfs(S.cur, goal);
    p.shift();
    S.path = p; S.state = "EN_ROUTE"; S.target = id;
  };
  const routeToDepot = (S) => {
    const p = graph.bfs(S.cur, S.depotKey);
    p.shift();
    S.path = p; S.state = "RETURNING"; S.target = null;
  };

  // ETA — qolgan masofa (metr) / tezlik
  const remainingMeters = (S) => {
    if (!S.path.length) return 0;
    let m = metersBetween(S.pos, graph.nodes.get(S.path[0]));
    for (let i = 0; i < S.path.length - 1; i++) m += metersBetween(graph.nodes.get(S.path[i]), graph.nodes.get(S.path[i + 1]));
    return m;
  };

  useEffect(() => {
    const stateLabel = { PATROL: "Patrulda", EN_ROUTE: "Yo'lda", EXTINGUISHING: "O'chirilmoqda", RETURNING: "Qaytmoqda" };
    const step = (ts) => {
      const S = sim.current;
      if (!lastRef.current) lastRef.current = ts;
      const dt = Math.min(0.05, (ts - lastRef.current) / 1000);
      lastRef.current = ts;

      // yangi yong'in (15-25s, agar 4 tadan kam bo'lsa)
      S.fireTimer -= dt;
      if (S.fireTimer <= 0) {
        S.fireTimer = 15 + Math.random() * 10;
        if (firesRef.current.size < 4) {
          const free = MAHALLA_AREAS.filter((a) => !firesRef.current.has(a.id));
          if (free.length) ignite(free[Math.floor(Math.random() * free.length)].id);
        }
      }

      // patrulda yong'in chiqsa — eng yaqiniga
      if (S.state === "PATROL" && firesRef.current.size) {
        const id = nearestFireBlock(S);
        if (id) routeToBlock(S, id);
      }

      if (S.state !== "EXTINGUISHING") {
        if (!S.path.length) {
          if (S.state === "PATROL") {
            const nbrs = [...graph.nodes.get(S.cur).nbrs];
            S.path = [nbrs[Math.floor(Math.random() * nbrs.length)]];
          } else if (S.state === "EN_ROUTE") {
            S.state = "EXTINGUISHING"; S.ext = 0;
          } else if (S.state === "RETURNING") {
            S.state = "PATROL";
          }
        }
        if (S.path.length) {
          const nd = graph.nodes.get(S.path[0]);
          const distM = metersBetween(S.pos, nd);
          const stepM = MPS * dt;
          if (distM <= stepM || distM < 2) {
            S.pos = { lat: nd.lat, lng: nd.lng }; S.cur = S.path.shift();
          } else {
            const t = stepM / distM;
            const a = project(S.pos), b = project(nd);
            S.angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
            S.pos = { lat: S.pos.lat + (nd.lat - S.pos.lat) * t, lng: S.pos.lng + (nd.lng - S.pos.lng) * t };
          }
        }
      } else {
        // EXTINGUISHING
        S.ext += dt;
        if (S.ext >= EXT_TIME) {
          if (S.target) extinguish(S.target);
          S.target = null; S.ext = 0;
          const nx = nearestFireBlock(S);
          if (nx) routeToBlock(S, nx);
          else routeToDepot(S);
        }
      }

      // truckni joylash
      if (truckRef.current) {
        const p = project(S.pos);
        truckRef.current.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${S.angle})`);
      }
      if (beaconRef.current) {
        const on = S.state === "EN_ROUTE" || S.state === "EXTINGUISHING";
        beaconRef.current.style.opacity = on ? (Math.sin(ts / 90) > 0 ? "1" : "0.25") : "0.15";
      }

      // HUD (~5/s)
      hudRef.current += dt;
      if (hudRef.current > 0.2) {
        hudRef.current = 0;
        const eta = S.state === "EN_ROUTE" ? Math.round(remainingMeters(S) / MPS) : null;
        const tb = S.target ? blockById[S.target] : null;
        onStatus?.({
          state: S.state,
          label: stateLabel[S.state],
          target: tb ? tb.name : null,
          eta,
          activeFires: firesRef.current.size,
        });
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effStatus = (a) => (activeFires.has(a.id) ? "fire" : a.status === "fire" ? "calm" : a.status);
  const depotS = project(DEPOT);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.08),transparent_60%)]">
      <defs>
        <filter id="fvv-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Bloklar */}
      {MAHALLA_AREAS.map((a) => {
        const pts = a.path.map(project);
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
        const c = project(a.center);
        const st = effStatus(a);
        const color = FIRE_STATUS[st].color;
        const isActive = active?.id === a.id;
        const visible = statusFilter.length === 0 || statusFilter.includes(a.status);
        return (
          <g key={a.id} className="cursor-pointer" onClick={() => onSelect(a)}>
            <path d={d} fill={color} fillOpacity={!visible ? 0.07 : isActive ? 0.6 : 0.34}
              stroke="#fff" strokeOpacity={!visible ? 0.08 : isActive ? 0.9 : 0.22} strokeWidth={isActive ? 3 : 1.1} />
            <text x={c.x} y={c.y - 26} textAnchor="middle" className="pointer-events-none fill-white text-[9.5px] font-semibold" opacity={visible ? 0.9 : 0.25}>
              {a.name}
            </text>
          </g>
        );
      })}

      {/* Binolar (bezak) */}
      {buildings.map((b, i) => (
        <rect key={`bd-${i}`} x={b.x - b.w / 2} y={b.y - b.h / 2} width={b.w} height={b.h} rx="1.2"
          fill="#1e293b" stroke="#475569" strokeWidth="0.5" opacity="0.6" className="pointer-events-none" />
      ))}

      {/* Yo'llar — blok chegaralari (grafga mos) */}
      {graph.edges.map(([a, b], i) => {
        const p = project(a), q = project(b);
        return (
          <g key={`rd-${i}`} className="pointer-events-none">
            <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#0b1322" strokeWidth="6" strokeLinecap="round" opacity="0.45" />
            <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#e7eef6" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
            <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.6" />
          </g>
        );
      })}

      {/* Depo */}
      <g className="pointer-events-none">
        <rect x={depotS.x - 8} y={depotS.y - 8} width="16" height="16" rx="3" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.4" />
        <text x={depotS.x} y={depotS.y + 4} textAnchor="middle" className="fill-white text-[9px] font-bold">13</text>
      </g>

      {/* Bino markerlari — tur rangi + harfi (bosilsa ma'lumot) */}
      {HOUSEHOLDS.map((h) => {
        const p = project(h.pos);
        const tm = OBJECT_TYPES[h.type] || OBJECT_TYPES.apartment;
        return (
          <g key={h.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onSelectHouse(h.id); }}>
            <rect x={p.x - 7.5} y={p.y - 7.5} width="15" height="15" rx="3.5" fill={tm.color} stroke="#fff" strokeWidth="1.1" opacity="0.96" />
            <text x={p.x} y={p.y + 0.4} textAnchor="middle" dominantBaseline="central" className="pointer-events-none fill-white text-[7px] font-bold">{tm.letter}</text>
            <text x={p.x} y={p.y + 16} textAnchor="middle" className="pointer-events-none fill-white/85 text-[7.5px] font-medium">{tm.label}</text>
          </g>
        );
      })}

      {/* Yong'in nuqtalari (faol) */}
      {[...activeFires].map((id) => {
        const a = blockById[id];
        if (!a) return null;
        const fpos = a.fires[0]?.pos || a.center;
        const p = project(fpos);
        return (
          <g key={`f-${id}`} className="pointer-events-none">
            <circle cx={p.x} cy={p.y} r="10" fill="#ef4444" opacity="0.22">
              <animate attributeName="r" values="6;15;6" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <circle cx={p.x} cy={p.y} r="4.2" fill="#f97316" stroke="#fff" strokeWidth="1.1" filter="url(#fvv-glow)" />
          </g>
        );
      })}

      {/* ── Yong'in mashinasi (Pajar) ── */}
      <g ref={truckRef}>
        <ellipse cx="0" cy="2" rx="9" ry="3.4" fill="#000" opacity="0.25" />
        <rect x="-8" y="-3.4" width="14" height="6.8" rx="1.6" fill="#dc2626" stroke="#fff" strokeWidth="0.5" />
        <rect x="4" y="-3" width="4.5" height="6" rx="1.2" fill="#b91c1c" stroke="#fff" strokeWidth="0.4" />
        <rect x="-7" y="-1" width="11" height="1.2" rx="0.6" fill="#cbd5e1" />
        <circle cx="-4" cy="3.8" r="1.6" fill="#111" />
        <circle cx="3" cy="3.8" r="1.6" fill="#111" />
        <g ref={beaconRef}>
          <rect x="-2.5" y="-5" width="5" height="1.6" rx="0.6" fill="#3b82f6">
            <animate attributeName="fill" values="#3b82f6;#ef4444;#3b82f6" dur="0.5s" repeatCount="indefinite" />
          </rect>
        </g>
      </g>
    </svg>
  );
};

export default FvvAreaMap;
