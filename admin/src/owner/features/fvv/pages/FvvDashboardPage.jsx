// Mahalla FVV — "FAVQULODDA VAZIYATLAR KOMANDAVOY MARKAZI". Quyuq, premium, yagona sahifa.
// FAQAT DEMO (backend/sensor/IoT yo'q) · faqat Navbahor MFY. Imzo: jonli sensor devori +
// favqulodda ALARM (hodisa turi + manzil + brigada ETA). ECharts + setInterval simulyatsiya.
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as echarts from "echarts";

/* ───────── Tokenlar ───────── */
const T = { bg: "#0A1119", panel: "#0F1A24", border: "#1E2D3D", gold: "#E0A93B", teal: "#2DD4BF", green: "#2FBF87", amber: "#E0A93B", red: "#E5484D", alarm: "#FF4D4D", text: "#E8EEF3", muted: "#7C8B99" };
const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = (n) => Math.round(n).toLocaleString("uz-UZ").replace(/,/g, " ");
const pad = (n) => String(n).padStart(2, "0");
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const now = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };

/* ───────── Sensorlar ───────── */
const SENSOR_DEF = [
  { id: "smoke", name: "Tutun / yong'in", loc: "Navbahor ko'chasi 14-uy", unit: "%", warn: 40, danger: 70, base: 8, span: 16 },
  { id: "gas", name: "Maishiy gaz (CH₄)", loc: "Bog' ko'chasi", unit: "%LEL", warn: 20, danger: 40, base: 5, span: 12 },
  { id: "water", name: "Suv sathi / sel", loc: "Ariq yoqasi", unit: "sm", warn: 90, danger: 140, base: 42, span: 30 },
  { id: "seismic", name: "Seysmik (magnituda)", loc: "MFY posti", unit: "M", warn: 3.5, danger: 5, base: 0.6, span: 1.2 },
  { id: "co", name: "Havo / is gazi (CO)", loc: "Markaziy ko'cha", unit: "ppm", warn: 120, danger: 250, base: 30, span: 60 },
  { id: "power", name: "Transformator harorati", loc: "Sanoat zonasi", unit: "°C", warn: 90, danger: 130, base: 46, span: 30 },
];
const sensorStatus = (s, v) => (v >= s.danger ? "xavf" : v >= s.warn ? "ogohlik" : "normal");
const statusColor = { normal: T.green, ogohlik: T.amber, xavf: T.alarm };
const initSensors = () => SENSOR_DEF.map((s) => ({ ...s, val: +(s.base + Math.random() * s.span * 0.5).toFixed(s.id === "seismic" ? 1 : 0), trend: Array.from({ length: 16 }, () => +(s.base + Math.random() * s.span * 0.4).toFixed(1)) }));

/* ───────── Hodisalar ───────── */
const STREETS = ["Navbahor ko'chasi", "Bog' ko'chasi", "Markaziy ko'cha", "Istiqlol ko'chasi", "Yangihayot ko'chasi", "Sanoat ko'chasi"];
const INC_TYPES = {
  fire: { name: "YONG'IN", icon: "🔥", color: T.alarm }, gas: { name: "GAZ SIZISHI", icon: "💨", color: T.gold },
  flood: { name: "SUV TOSHQINI", icon: "🌊", color: T.teal }, tech: { name: "TEXNOGEN AVARIYA", icon: "⚙️", color: "#a78bfa" },
  med: { name: "TIBBIY FAVQULODDA", icon: "🚑", color: "#ef4444" },
};
const BRIGADES = ["13-yong'in qutqaruv qismi", "Tuman FVV brigadasi", "Tez tibbiy yordam", "Gaz avariya xizmati"];
const RISK = [["past", T.green], ["o'rta", T.amber], ["yuqori", T.alarm]];
let INCID = 0;
const genIncident = (typeKey, source) => {
  INCID++; const t = INC_TYPES[typeKey] || pick(Object.values(INC_TYPES));
  const key = typeKey && INC_TYPES[typeKey] ? typeKey : pick(Object.keys(INC_TYPES));
  const r = pick(RISK);
  return { id: INCID, key, ...INC_TYPES[key], addr: `${pick(STREETS)}, ${ri(1, 86)}-uy`, risk: r[0], riskColor: r[1], time: now(), date: new Date().toLocaleString("uz-UZ"), source, brigade: pick(BRIGADES), eta: ri(3, 9), checked: false };
};

/* ───────── CSS ───────── */
const CSS = `
.fcc{font-family:Inter,system-ui,sans-serif;color:${T.text};background:${T.bg};min-height:100%;position:relative;overflow:hidden}
.fcc::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(900px 500px at 18% -8%,rgba(224,169,59,.10),transparent 60%),radial-gradient(800px 600px at 95% 8%,rgba(45,212,191,.08),transparent 60%),radial-gradient(700px 500px at 50% 120%,rgba(255,77,77,.06),transparent 60%)}
.fcc::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:38px 38px;animation:fccGrid 40s linear infinite}
@keyframes fccGrid{to{background-position:38px 38px}}
.fcc h1,.fcc h2,.fcc h3{font-family:"Space Grotesk",Inter,sans-serif}
.fcc .mono{font-family:"JetBrains Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}
.fcc *{box-sizing:border-box}
.fcc-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;padding:12px 20px;flex-wrap:wrap;background:rgba(10,17,25,.72);backdrop-filter:blur(12px);border-bottom:1px solid ${T.border};transform:translateY(-100%);animation:fccDrop .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes fccDrop{to{transform:translateY(0)}}
.fcc-emb{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,${T.alarm},#7a1414);display:grid;place-items:center;font-weight:800;color:#fff;font-family:"Space Grotesk";box-shadow:0 0 18px rgba(255,77,77,.4)}
.fcc-top .nm{font-weight:700;font-size:15px;font-family:"Space Grotesk"}.fcc-top .sb{font-size:11px;color:${T.muted}}
.fcc-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:${T.teal}}
.fcc-live i{width:7px;height:7px;border-radius:50%;background:${T.teal};box-shadow:0 0 8px ${T.teal};animation:fccPulse 1.4s ease-in-out infinite}
@keyframes fccPulse{50%{opacity:.3;transform:scale(.7)}}
.fcc-demo{font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:rgba(224,169,59,.16);color:${T.gold}}
.fcc-wrap{position:relative;z-index:1;padding:18px 20px;max-width:1600px;margin:0 auto}
.fcc-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
.fcc-card{background:linear-gradient(180deg,rgba(15,26,36,.82),rgba(12,21,30,.82));border:1px solid ${T.border};border-radius:16px;padding:14px 16px;box-shadow:0 1px 0 rgba(255,255,255,.03) inset,0 18px 40px -24px rgba(0,0,0,.9);backdrop-filter:blur(8px);display:flex;flex-direction:column;min-width:0;opacity:0;transform:translateY(16px);animation:fccUp .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes fccUp{to{opacity:1;transform:translateY(0)}}
.fcc-card .hd{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:10px}
.fcc-card .hd .t{font-weight:700;font-size:13.5px;font-family:"Space Grotesk"}.fcc-card .hd .s{font-size:11px;color:${T.muted}}
.fcc-exp{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:28px;height:28px;display:grid;place-items:center;cursor:pointer;color:${T.muted}}
.fcc-exp:hover{color:${T.text};border-color:${T.gold}}
.fcc-ch{width:100%;overflow:hidden;position:relative}
.fcc-note{font-size:11px;color:${T.muted};margin-top:8px}
.fcc-pill{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(224,169,59,.14);color:${T.gold}}
.fcc-hero{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:14px;margin-bottom:14px}
.fcc-kpi{background:rgba(15,26,36,.8);border:1px solid ${T.border};border-radius:16px;padding:14px 16px}
.fcc-kpi .lab{font-size:11px;color:${T.muted};font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.fcc-kpi .val{font-family:"JetBrains Mono";font-size:30px;font-weight:700;margin-top:6px}
.fcc-safe{background:radial-gradient(120% 120% at 30% 0%,rgba(47,191,135,.16),rgba(15,26,36,.85));border:1px solid rgba(47,191,135,.35);border-radius:18px;padding:16px 18px}
.fcc-safe .big{font-family:"JetBrains Mono";font-size:58px;font-weight:700;line-height:1;color:${T.green};text-shadow:0 0 22px rgba(47,191,135,.5)}
.fcc-sens{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.fcc-sensc{border:1px solid ${T.border};border-radius:12px;padding:11px 13px;background:rgba(255,255,255,.02);cursor:pointer;transition:.15s;position:relative;overflow:hidden}
.fcc-sensc:hover{transform:translateY(-2px);border-color:rgba(224,169,59,.4)}
.fcc-dot{width:8px;height:8px;border-radius:99px;animation:fccPulse 1.3s infinite}
.fcc-alarm{border:1px solid rgba(255,77,77,.5);border-radius:18px;padding:16px 18px;background:radial-gradient(120% 130% at 18% 0%,rgba(255,77,77,.22),rgba(15,26,36,.9));box-shadow:0 0 40px -8px rgba(255,77,77,.5);display:flex;gap:18px;align-items:center;animation:fccBoom .5s cubic-bezier(.2,.9,.2,1)}
@keyframes fccBoom{0%{transform:scale(.85);opacity:0}60%{transform:scale(1.02)}100%{transform:scale(1)}}
.fcc-alarm.glow{animation:fccAl 1.6s ease-in-out infinite}
@keyframes fccAl{50%{box-shadow:0 0 60px -6px rgba(255,77,77,.8)}}
.fcc-btn{background:rgba(255,255,255,.05);color:${T.text};border:1px solid ${T.border};border-radius:8px;padding:7px 14px;font-size:12.5px;cursor:pointer}
.fcc-btn:hover{border-color:${T.gold}}
.fcc-staffgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.fcc-staffc{border:1px solid ${T.border};border-radius:12px;padding:11px 13px;background:rgba(255,255,255,.02)}
.fcc-c3{grid-column:span 3}.fcc-c4{grid-column:span 4}.fcc-c5{grid-column:span 5}.fcc-c6{grid-column:span 6}.fcc-c7{grid-column:span 7}.fcc-c8{grid-column:span 8}.fcc-c12{grid-column:span 12}
.fcc-modal{position:fixed;inset:0;z-index:99999;background:rgba(5,10,15,.78);display:grid;place-items:center;padding:18px;backdrop-filter:blur(4px)}
.fcc-mbox{color:${T.text};font-family:Inter;background:${T.panel};border:1px solid ${T.border};border-radius:18px;width:min(900px,96vw);max-height:88vh;overflow:auto;display:flex;flex-direction:column;padding:18px 20px;box-shadow:0 40px 100px rgba(0,0,0,.7)}
.fcc-x{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:34px;height:34px;cursor:pointer;color:${T.text};font-size:18px}
.hex{transition:transform .18s,filter .18s;cursor:pointer;transform-box:fill-box;transform-origin:center}.hex:hover{transform:scale(1.12);filter:brightness(1.25)}
.fcc a:focus-visible,.fcc button:focus-visible{outline:3px solid ${T.gold};outline-offset:2px;border-radius:8px}
@media(max-width:1100px){.fcc-hero{grid-template-columns:repeat(2,1fr)}.fcc-sens{grid-template-columns:repeat(2,1fr)}.fcc-c4,.fcc-c5,.fcc-c6,.fcc-c7,.fcc-c8{grid-column:span 12}.fcc-c3{grid-column:span 6}}
@media(prefers-reduced-motion:reduce){.fcc *,.fcc::after{animation:none!important;transition:none!important}.fcc-card,.fcc-top{opacity:1!important;transform:none!important}}
`;

/* ───────── Hooks ───────── */
function useCountUp(target, dur = 1300) { const [v, setV] = useState(reduced ? target : 0); useEffect(() => { if (reduced) { setV(target); return; } let raf; const t0 = performance.now(); const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setV(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [target, dur]); return v; }
function useClock() { const [t, setT] = useState(now); useEffect(() => { const id = setInterval(() => setT(now()), 1000); return () => clearInterval(id); }, []); return t; }

function Spark({ data, color, w = 116, h = 30 }) {
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${(h - ((v - min) / (max - min || 1)) * h).toFixed(1)}`).join(" ");
  return <svg width={w} height={h} style={{ display: "block" }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" /></svg>;
}

function EPanel({ title, subtitle, note, option, className = "fcc-c6", delay = 0, height = 220 }) {
  const ref = useRef(null), inst = useRef(null), mref = useRef(null), minst = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!ref.current) return; inst.current = echarts.init(ref.current); inst.current.setOption(option); const ro = new ResizeObserver(() => inst.current && inst.current.resize()); ro.observe(ref.current); return () => { ro.disconnect(); inst.current && inst.current.dispose(); }; }, []);
  useEffect(() => { inst.current && inst.current.setOption(option, true); }, [option]);
  useEffect(() => { if (!open || !mref.current) return; minst.current = echarts.init(mref.current); minst.current.setOption(option); const ro = new ResizeObserver(() => minst.current && minst.current.resize()); ro.observe(mref.current); const k = (e) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", k); return () => { ro.disconnect(); window.removeEventListener("keydown", k); minst.current && minst.current.dispose(); }; }, [open]);
  return (
    <div className={`fcc-card ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="hd"><div><div className="t">{title}</div>{subtitle && <div className="s">{subtitle}</div>}</div><button className="fcc-exp" onClick={() => setOpen(true)} aria-label={`${title} kengaytirish`}>⤢</button></div>
      <div className="fcc-ch" ref={ref} style={{ height }} />
      {note && <div className="fcc-note">{note}</div>}
      {open && createPortal(<div className="fcc-modal" onClick={() => setOpen(false)}><div className="fcc-mbox" style={{ height: "min(82vh,820px)" }} onClick={(e) => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 16 }}>{title}</div><button className="fcc-x" onClick={() => setOpen(false)}>×</button></div><div ref={mref} style={{ flex: 1 }} /></div></div>, document.body)}
    </div>
  );
}

/* ───────── Hex xavf xaritasi ───────── */
const HEXB = [["Markaziy", 1, "—"], ["Bog'", 0, "—"], ["Maktab-12", 0, "—"], ["Bozor", 2, "elektr"], ["Sanoat", 4, "yong'in"], ["Yangi daha", 1, "—"], ["Maktab-47", 0, "—"], ["Ariq yoqasi", 3, "suv"], ["Park", 0, "—"], ["Gaz punkti", 4, "gaz"], ["Avtostansiya", 2, "texnogen"], ["Eski mahalla", 3, "yong'in"]].map(([name, risk, kind]) => ({ name, risk, kind }));
function HexMap() {
  const [hv, setHv] = useState(null); const s = 34, w = s * 1.5, h = Math.sqrt(3) * s;
  const col = (r) => [T.green, "#86c98f", T.gold, "#e08a2c", T.alarm][r];
  const pts = (cx, cy) => Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 180) * (60 * i); return `${(cx + s * Math.cos(a)).toFixed(1)},${(cy + s * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const W = 4 * w + s, H = 3 * h + s + 20;
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="Mahalla xavf xaritasi">
        {HEXB.map((b, i) => { const c = i % 4, r = Math.floor(i / 4), cx = s + c * w + 4, cy = s + 10 + r * h + (c % 2 ? h / 2 : 0), k = col(b.risk); return (
          <g key={b.name} className="hex" onMouseEnter={() => setHv(b)} onMouseLeave={() => setHv(null)} tabIndex={0} onFocus={() => setHv(b)} onBlur={() => setHv(null)}>
            <polygon points={pts(cx, cy)} fill={k} fillOpacity={b.risk >= 3 ? .85 : .5} stroke={k} strokeWidth="1.5" style={{ filter: b.risk >= 3 ? `drop-shadow(0 0 6px ${k})` : "none" }} />
            <text x={cx} y={cy + 2} textAnchor="middle" fontSize="7" fill="#06121a" fontWeight="700" style={{ pointerEvents: "none" }}>{b.kind}</text>
          </g>); })}
      </svg>
      <div style={{ position: "absolute", left: 8, bottom: 2, fontSize: 11, color: T.muted }}>{hv ? <span><b style={{ color: T.text }}>{hv.name}</b> · xavf: {["xavfsiz", "past", "o'rta", "yuqori", "kritik"][hv.risk]} ({hv.kind})</span> : "Zona ustiga olib boring"}</div>
    </div>
  );
}

/* ───────── Asosiy ───────── */
const FvvDashboardPage = () => {
  useEffect(() => { if (!document.getElementById("fcc-style")) { const st = document.createElement("style"); st.id = "fcc-style"; st.textContent = CSS; document.head.appendChild(st); } if (!document.getElementById("fcc-fonts")) { const l = document.createElement("link"); l.id = "fcc-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700;800&display=swap"; document.head.appendChild(l); } }, []);
  const clk = useClock();
  const [sensors, setSensors] = useState(initSensors);
  const [alarms, setAlarms] = useState([]);
  const [selSensor, setSelSensor] = useState(null);
  const [selInc, setSelInc] = useState(null);

  useEffect(() => {
    if (reduced) return; let stop = false;
    const tick = () => {
      if (stop) return;
      setSensors((prev) => prev.map((s) => {
        const spike = Math.random() < 0.05;
        let v = s.val + (Math.random() - 0.45) * s.span * 0.3;
        if (spike) v = s.warn + Math.random() * (s.danger - s.warn + s.span * 0.4);
        v = Math.max(0, +v.toFixed(s.id === "seismic" ? 1 : 0));
        return { ...s, val: v, trend: [...s.trend.slice(1), v] };
      }));
      // ~15% ALARM (sensor xavf yoki 112 chaqiruv)
      if (Math.random() < 0.18) {
        const map = { smoke: "fire", gas: "gas", water: "flood", seismic: "tech", co: "med", power: "tech" };
        const s = pick(SENSOR_DEF); const inc = genIncident(map[s.id], `${s.name} datchigi`);
        setAlarms((p) => [inc, ...p].slice(0, 10));
      }
      setTimeout(tick, ri(3000, 6000));
    };
    const id = setTimeout(tick, 2000);
    return () => { stop = true; clearTimeout(id); };
  }, []);

  const safeDays = useCountUp(23); const calls = useCountUp(4); const active = useCountUp(1);

  const riskGauge = useMemo(() => ({ backgroundColor: "transparent", series: [{ type: "gauge", startAngle: 200, endAngle: -20, min: 0, max: 100, radius: "92%", center: ["50%", "60%"], progress: { show: false }, pointer: { itemStyle: { color: T.gold }, width: 5, length: "62%" }, axisLine: { lineStyle: { width: 14, color: [[0.33, T.green], [0.66, T.gold], [1, T.alarm]] } }, axisTick: { show: false }, splitLine: { length: 12, lineStyle: { color: "#fff", width: 1 } }, axisLabel: { show: false }, anchor: { show: true, size: 10, itemStyle: { color: T.gold } }, detail: { valueAnimation: true, formatter: "Sariq", color: T.gold, fontSize: 16, fontFamily: "Space Grotesk", offsetCenter: [0, "38%"] }, data: [{ value: 55 }] }] }), []);
  const incDonut = useMemo(() => ({ backgroundColor: "transparent", tooltip: { trigger: "item", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } }, legend: { bottom: 0, textStyle: { color: T.muted, fontSize: 10 }, icon: "circle" }, series: [{ type: "pie", radius: ["48%", "72%"], center: ["50%", "42%"], label: { show: false }, data: [{ value: 14, name: "Yong'in", itemStyle: { color: T.alarm } }, { value: 9, name: "Maishiy gaz", itemStyle: { color: T.gold } }, { value: 5, name: "Suv/sel", itemStyle: { color: T.teal } }, { value: 4, name: "Texnogen", itemStyle: { color: "#a78bfa" } }, { value: 7, name: "Tibbiy", itemStyle: { color: "#ef4444" } }, { value: 3, name: "Boshqa", itemStyle: { color: "#64748b" } }] }] }), []);
  const trend7 = useMemo(() => ({ backgroundColor: "transparent", grid: { left: 8, right: 12, top: 16, bottom: 22, containLabel: true }, tooltip: { trigger: "axis", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } }, xAxis: { type: "category", data: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"], axisLabel: { color: T.muted, fontSize: 10 }, axisLine: { lineStyle: { color: "rgba(255,255,255,.14)" } } }, yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,.05)" } }, axisLabel: { color: T.muted, fontSize: 9 } }, series: [{ type: "bar", data: [3, 5, 2, 6, 4, 7, 4], itemStyle: { color: T.gold, borderRadius: [4, 4, 0, 0] }, barWidth: "55%" }] }), []);

  const latest = alarms[0];

  return (
    <div className="fcc">
      <div className="fcc-top">
        <div className="fcc-emb">FVV</div>
        <div style={{ marginRight: "auto" }}><div className="nm">Favqulodda Vaziyatlar Komandavoy Markazi</div><div className="sb">Navbahor MFY · Yunusobod tumani, Toshkent · ~4 200 aholi · ~980 xonadon</div></div>
        <span className="fcc-live"><i /> JONLI</span><span className="fcc-demo">DEMO — namunaviy</span>
        <div className="sb mono">{clk}</div>
      </div>

      <div className="fcc-wrap">
        {/* HERO */}
        <div className="fcc-hero">
          <div className="fcc-safe"><div style={{ fontSize: 11, color: "#9fe3c4", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px" }}>Favqulodda hodisasiz kunlar</div><div className="big">{fmt(safeDays)}</div><div style={{ fontSize: 11.5, color: T.muted, marginTop: 6 }}>Navbahor MFY · uzluksiz</div></div>
          <div className="fcc-kpi"><div className="lab">Bugungi 112 chaqiruvlari</div><div className="val" style={{ color: T.text }}>{fmt(calls)}</div><div style={{ fontSize: 11, color: T.alarm, marginTop: 2 }}>faol hodisa: {fmt(active)}</div></div>
          <div className="fcc-card" style={{ animationDelay: "60ms", padding: "8px 10px 0" }}><div style={{ fontSize: 11, color: T.muted, fontWeight: 600, textTransform: "uppercase", padding: "6px 6px 0" }}>Umumiy xavf darajasi</div><div className="fcc-ch" style={{ height: 110 }}><RiskGaugeChart option={riskGauge} /></div></div>
          <div className="fcc-kpi"><div className="lab">O'rtacha brigada ETA</div><div className="val" style={{ color: T.teal }}>6 daq</div><div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>eng yaqin kuch</div></div>
        </div>

        {/* ALARM */}
        {latest && (
          <div className="fcc-alarm glow" style={{ marginBottom: 14 }} key={latest.id}>
            <div style={{ flex: "0 0 auto", width: 92, height: 92, borderRadius: 16, display: "grid", placeItems: "center", fontSize: 44, background: "rgba(255,77,77,.12)", border: `1px solid ${latest.color}55` }}>{latest.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: 20, color: latest.color }}>⚠ {latest.name}</div><span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 999, background: latest.riskColor + "22", color: latest.riskColor }}>xavf: {latest.risk}</span></div>
              <div style={{ fontSize: 14, marginTop: 6 }}>📍 <b>{latest.addr}</b></div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Manba: {latest.source} · {latest.date}</div>
              <div style={{ fontSize: 13, marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap" }}><span>🚒 Brigada: <b style={{ color: T.teal }}>{latest.brigade}</b></span><span>⏱ ETA: <b className="mono" style={{ color: T.gold }}>{latest.eta} daq</b></span></div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="fcc-btn" style={{ borderColor: T.gold, color: T.gold }} onClick={() => setSelInc(latest)}>Tasdiqlash</button>
                <button className="fcc-btn" onClick={() => alert("DEMO: brigada yuborildi")}>Brigada yuborish</button>
                <button className="fcc-btn" onClick={() => setAlarms((p) => p.map((a) => a.id === latest.id ? { ...a, checked: true } : a))}>Yopish</button>
              </div>
            </div>
          </div>
        )}

        {/* Sensor devori + alarm jurnali */}
        <div className="fcc-grid" style={{ marginBottom: 14 }}>
          <div className="fcc-card fcc-c8" style={{ animationDelay: "120ms" }}>
            <div className="hd"><div><div className="t">Jonli xavf monitoringi — sensor devori</div><div className="s">Mahalla bo'ylab {sensors.length} sensor · real vaqtda</div></div><span className="fcc-pill">DEMO simulyatsiya</span></div>
            <div className="fcc-sens">{sensors.map((s) => { const stt = sensorStatus(s, s.val); const c = statusColor[stt]; return (
              <button className="fcc-sensc" key={s.id} onClick={() => setSelSensor(s)} style={{ textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div><div style={{ fontSize: 9.5, color: T.muted }}>{s.loc}</div></div><span className="fcc-dot" style={{ background: c, boxShadow: `0 0 8px ${c}` }} /></div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}><span className="mono" style={{ fontSize: 24, fontWeight: 700, color: c }}>{s.val}</span><span style={{ fontSize: 10, color: T.muted }}>{s.unit}</span><span style={{ marginLeft: "auto", fontSize: 9.5, fontWeight: 700, color: c, textTransform: "uppercase" }}>{stt}</span></div>
                <div style={{ marginTop: 4 }}><Spark data={s.trend} color={c} /></div>
              </button>); })}</div>
          </div>
          <div className="fcc-card fcc-c4" style={{ animationDelay: "200ms" }}>
            <div className="hd"><div><div className="t">Favqulodda hodisalar jurnali</div><div className="s">Oxirgi 10 · bosib tafsilot</div></div></div>
            <div style={{ maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {alarms.length === 0 && <div style={{ color: T.muted, fontSize: 12, padding: 16, textAlign: "center" }}>Kuzatuv davom etmoqda…</div>}
              {alarms.map((a) => (
                <div key={a.id} role="button" tabIndex={0} onClick={() => setSelInc(a)} onKeyDown={(e) => e.key === "Enter" && setSelInc(a)} style={{ cursor: "pointer", border: `1px solid ${a.checked ? T.border : a.color + "66"}`, borderRadius: 10, padding: 9, background: a.checked ? "rgba(255,255,255,.02)" : a.color + "12", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 700, color: a.checked ? T.muted : a.color }}>{a.name}</div><div style={{ fontSize: 10, color: T.muted }}>{a.addr} · {a.time}</div></div>
                  <span className="mono" style={{ fontSize: 11, color: T.gold }}>{a.eta}d</span>
                </div>))}
            </div>
          </div>
        </div>

        {/* Kartalar */}
        <div className="fcc-grid">
          <EPanel className="fcc-c4" delay={240} height={210} title="Hodisalar turi" subtitle="Oxirgi 30 kun" option={incDonut} note={<span className="fcc-pill">DEMO</span>} />
          <EPanel className="fcc-c5" delay={280} height={210} title="Hodisalar tendentsiyasi" subtitle="Oxirgi 7 kun" option={trend7} note={<span className="fcc-pill">DEMO</span>} />
          <div className="fcc-card fcc-c3" style={{ animationDelay: "320ms" }}><div className="hd"><div><div className="t">Xavf xaritasi</div><div className="s">Zonalar bo'yicha</div></div></div><HexMap /><div className="fcc-note"><span className="fcc-pill">DEMO</span></div></div>

          <div className="fcc-card fcc-c5" style={{ animationDelay: "360ms" }}>
            <div className="hd"><div><div className="t">Xavfli obyektlar</div><div className="s">Joylashuv va xavf darajasi</div></div></div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}><tbody>{[["Gaz taqsimlash punkti", "Bog' ko'chasi", "yuqori", T.alarm], ["Transformator (3 ta)", "Sanoat / Markaziy", "o'rta", T.gold], ["Avariyaviy bino (2 ta)", "Eski mahalla", "yuqori", T.alarm], ["Yoqilg'i shoxobchasi", "Avtostansiya", "o'rta", T.gold]].map(([n, loc, r, c]) => <tr key={n} style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}><td style={{ padding: "9px 4px", fontWeight: 600 }}>{n}<div style={{ fontSize: 10, color: T.muted }}>{loc}</div></td><td style={{ textAlign: "right" }}><span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: c + "22", color: c }}>{r}</span></td></tr>)}</tbody></table>
          </div>
          <div className="fcc-card fcc-c4" style={{ animationDelay: "400ms" }}>
            <div className="hd"><div><div className="t">Mavsumiy xavf</div><div className="s">Joriy: bahor</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ border: `1px solid ${T.teal}44`, borderRadius: 10, padding: "8px 10px", background: T.teal + "0f" }}><div style={{ fontSize: 12, fontWeight: 700, color: T.teal }}>🌱 Bahor — faol</div><div style={{ fontSize: 11, color: T.muted }}>Suv toshqini · sel · ko'chki</div></div>
              <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 10px" }}><div style={{ fontSize: 12, fontWeight: 700, color: T.muted }}>❄️ Qish</div><div style={{ fontSize: 11, color: T.muted }}>Gaz · is gazi (CO) · yong'in</div></div>
            </div>
          </div>
          <div className="fcc-card fcc-c3" style={{ animationDelay: "440ms" }}>
            <div className="hd"><div><div className="t">Ogohlantirish tizimi</div><div className="s">Holat</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>{[["Sirena", "ishlayapti", T.green], ["SMS ulug'i", "faol", T.green], ["Karnay (ko'cha)", "ishlayapti", T.green]].map(([l, v, c]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 10, background: "rgba(255,255,255,.02)" }}><span style={{ fontSize: 12.5 }}>{l}</span><span style={{ fontSize: 11, fontWeight: 700, color: c }}>● {v}</span></div>)}</div>
          </div>

          <div className="fcc-card fcc-c4" style={{ animationDelay: "480ms" }}>
            <div className="hd"><div><div className="t">Xavf guruhidagi xonadonlar</div><div className="s">17 xonadon · manzilli</div></div></div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>{[["Yolg'iz keksa", 9, T.gold], ["Nogironligi bor", 4, T.teal], ["Eski gaz/elektr", 4, T.alarm]].map(([l, n, c]) => <div key={l} style={{ flex: 1, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px", textAlign: "center" }}><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: c }}>{n}</div><div style={{ fontSize: 9.5, color: T.muted }}>{l}</div></div>)}</div>
            <div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.8 }}>Navbahor 8-uy · Bog' 12-uy · Markaziy 5-uy · Istiqlol 21-uy …</div>
          </div>
          <div className="fcc-card fcc-c4" style={{ animationDelay: "520ms" }}>
            <div className="hd"><div><div className="t">Evakuatsiya</div><div className="s">Yig'ilish nuqtalari</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[["Maktab hovlisi (12-maktab)", "1 200 kishi"], ["Markaziy maydon", "2 000 kishi"]].map(([n, cap]) => <div key={n} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,.02)" }}><div><div style={{ fontWeight: 600, fontSize: 12.5 }}>📍 {n}</div><div style={{ fontSize: 10.5, color: T.muted }}>yig'ilish nuqtasi</div></div><span className="mono" style={{ color: T.teal, fontSize: 12 }}>{cap}</span></div>)}</div>
          </div>
          <div className="fcc-card fcc-c4" style={{ animationDelay: "560ms" }}>
            <div className="hd"><div><div className="t">Yong'in tekshiruvlari & mashqlar</div><div className="s">Profilaktika</div></div></div>
            <div style={{ display: "flex", gap: 8 }}>{[["Bajarilgan", 12, T.green], ["Rejada", 5, T.gold], ["Kamchilikli", 3, T.alarm]].map(([l, n, c]) => <div key={l} style={{ flex: 1, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px", textAlign: "center" }}><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: c }}>{n}</div><div style={{ fontSize: 9.5, color: T.muted }}>{l}</div></div>)}</div>
            <div style={{ marginTop: 10, fontSize: 12 }}>O'quv mashqlari: <b className="mono">4/yil</b> · aholi qamrovi <b className="mono" style={{ color: T.teal }}>61%</b><div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,.07)", marginTop: 5, overflow: "hidden" }}><div style={{ width: "61%", height: "100%", background: T.teal }} /></div></div>
          </div>
        </div>

        {/* FVV kuchlari */}
        <div className="fcc-grid" style={{ marginTop: 14 }}>
          <div className="fcc-card fcc-c8" style={{ animationDelay: "600ms" }}>
            <div className="hd"><div><div className="t">Mahalla fuqaro muhofazasi yig'ma guruhi</div><div className="s">Tezkor kuchlar tarkibi</div></div></div>
            <div className="fcc-staffgrid">{[
              ["Olimov Rustam", "Yig'ma guruh rahbari", "Navbahor MFY", "shay", T.green],
              ["Karimov Akmal", "Tuman FVV inspektori", "MFY bo'yicha", "shay", T.green],
              ["Tursunov Sardor", "Yong'in xavfsizligi inspektori", "1–6-bloklar", "yo'lda", T.gold],
              ["Qizil Yarim oy otryadi", "Ko'ngillilar (8 kishi)", "MFY bo'yicha", "shay", T.green],
              ["Sobirov Eldor", "Vatanparvar vakili", "MFY bo'yicha", "dam", T.muted],
            ].map(([nm, role, zona, holat, c]) => (
              <div className="fcc-staffc" key={nm}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{nm}</div><div style={{ fontSize: 11.5, color: T.teal }}>{role}</div>
                <div style={{ fontSize: 10.5, color: T.muted, marginTop: 3 }}>Hudud: {zona}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}><span style={{ fontSize: 10.5, color: c, fontWeight: 600 }}>● {holat}</span><button className="fcc-btn" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => alert("DEMO: 112 bilan bog'lanish")}>112</button></div>
              </div>))}</div>
          </div>
          <div className="fcc-card fcc-c4" style={{ animationDelay: "640ms" }}>
            <div className="hd"><div><div className="t">Texnika va jihozlar</div><div className="s">Shaylik</div></div></div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}><tbody>{[["Qutqaruv mashinasi", "1/1", T.green], ["Yong'in o'chirgich", "24/26", T.gold], ["Suv nasosi", "2/2", T.green], ["Generator", "1/2", T.amber], ["Aloqa stansiyasi", "1/1", T.green]].map(([n, v, c]) => <tr key={n} style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}><td style={{ padding: "9px 4px" }}>{n}</td><td style={{ textAlign: "right" }} className="mono"><span style={{ color: c, fontWeight: 700 }}>{v}</span></td></tr>)}</tbody></table>
            <button className="fcc-btn" style={{ marginTop: 10, width: "100%", borderColor: T.alarm, color: T.alarm }} onClick={() => alert("DEMO: 112 bilan bog'lanish")}>112 bilan bog'lanish</button>
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 11.5, color: T.muted }}>Barcha ma'lumotlar — <b>DEMO (namunaviy/simulyatsiya)</b>. Faqat Navbahor MFY. Backend/sensor yo'q.</div>
      </div>

      {selSensor && createPortal(<div className="fcc-modal" onClick={() => setSelSensor(null)}><div className="fcc-mbox" style={{ width: "min(560px,94vw)" }} onClick={(e) => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><div><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 17 }}>{selSensor.name}</div><div style={{ fontSize: 11, color: T.muted }}>{selSensor.loc}</div></div><button className="fcc-x" onClick={() => setSelSensor(null)}>×</button></div><div style={{ display: "flex", gap: 16, alignItems: "baseline", margin: "8px 0" }}><span className="mono" style={{ fontSize: 40, fontWeight: 700, color: statusColor[sensorStatus(selSensor, selSensor.val)] }}>{selSensor.val}</span><span style={{ color: T.muted }}>{selSensor.unit}</span><span style={{ marginLeft: "auto", color: T.muted, fontSize: 12 }}>Ogohlik ≥ {selSensor.warn} · Xavf ≥ {selSensor.danger}</span></div><Spark data={selSensor.trend} color={statusColor[sensorStatus(selSensor, selSensor.val)]} w={500} h={120} /><div style={{ marginTop: 10 }}><span className="fcc-pill">DEMO</span></div></div></div>, document.body)}

      {selInc && createPortal(<div className="fcc-modal" onClick={() => setSelInc(null)}><div className="fcc-mbox" style={{ width: "min(560px,94vw)" }} onClick={(e) => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 32 }}>{selInc.icon}</span><div><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: 18, color: selInc.color }}>{selInc.name}</div><div style={{ fontSize: 11, color: T.muted }}>Favqulodda hodisa</div></div></div><button className="fcc-x" onClick={() => setSelInc(null)}>×</button></div>{[["Manzil", selInc.addr], ["Xavf darajasi", selInc.risk], ["Manba", selInc.source], ["Aniqlangan vaqt", selInc.date], ["Brigada", selInc.brigade], ["Yetib kelish (ETA)", `${selInc.eta} daqiqa`]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}><span style={{ color: T.muted }}>{l}</span><span style={{ fontWeight: 600, color: l === "Xavf darajasi" ? selInc.riskColor : T.text }}>{v}</span></div>)}<div style={{ display: "flex", gap: 8, marginTop: 14 }}><button className="fcc-btn" style={{ borderColor: T.alarm, color: T.alarm }} onClick={() => alert("DEMO: brigada yo'lga chiqdi")}>Brigada yuborish</button></div><div style={{ marginTop: 10 }}><span className="fcc-pill">DEMO</span></div></div></div>, document.body)}
    </div>
  );
};

function RiskGaugeChart({ option }) { const ref = useRef(null); useEffect(() => { if (!ref.current) return; const i = echarts.init(ref.current); i.setOption(option); const ro = new ResizeObserver(() => i.resize()); ro.observe(ref.current); return () => { ro.disconnect(); i.dispose(); }; }, []); return <div ref={ref} style={{ width: "100%", height: "100%" }} />; }

export default FvvDashboardPage;
