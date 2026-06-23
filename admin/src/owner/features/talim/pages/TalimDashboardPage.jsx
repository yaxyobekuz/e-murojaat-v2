// Mahalla Ta'lim KOMANDAVOY MARKAZI — quyuq, premium, yagona sahifali dashboard.
// Imzo: Sankey oqim ("bola qayoqqa ketadi") + hex-grid "tirik mahalla".
// Dramatik markaz: "Ta'limdan chetda qolgan bolalar soni". ECharts + SVG. Namunaviy mahalla, real milliy.
import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";

/* ───────── Tokenlar ───────── */
const T = {
  bg: "#0A1119", panel: "#0F1A24", border: "#1E2D3D",
  gold: "#E0A93B", teal: "#2DD4BF", green: "#2FBF87", amber: "#E0A93B", red: "#E5484D", alarm: "#FF4D4D",
  text: "#E8EEF3", muted: "#7C8B99",
};
const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = (n) => Math.round(n).toLocaleString("uz-UZ").replace(/,/g, " ");
const rng = (s) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

/* ───────── Ma'lumotlar ───────── */
// MAHALLA — namunaviy (sintetik)
const M = {
  name: "Navbahor MFY", area: "Yunusobod tumani, Toshkent",
  children6_18: 2680, inSchool: 2540, outOfSchool: 31,
  outBreakdown: [["Ish bilan band", 12], ["Kasallik", 7], ["Sabab noaniq", 9], ["Ko'chib ketgan", 3]],
  preschool: 78, chronic: 24, present: 2392, excused: 89, absent: 59,
};
const SCHOOLS = [
  { name: "12-maktab", students: 1240, type: "Davlat", shift: "2-smena", cov: 98.4 },
  { name: "47-maktab", students: 980, type: "Davlat", shift: "1-smena", cov: 99.1 },
  { name: "Bilim xususiy maktabi", students: 320, type: "Xususiy", shift: "1-smena", cov: 99.6 },
];
const CLASSES = Array.from({ length: 11 }, (_, i) => ({ g: i + 1, v: +(90 + rng(i * 5 + 2) * 8).toFixed(1) }));
const dayLabel = (b) => { const d = new Date(2026, 5, 24); d.setDate(d.getDate() - b); return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`; };
const TREND = Array.from({ length: 30 }, (_, i) => ({ d: dayLabel(29 - i), v: +(92 + rng(i * 3 + 1) * 5).toFixed(1) }));
const NAMES = ["Aziz K.", "Madina R.", "Jasur T.", "Nilufar S.", "Bekzod O.", "Dilnoza A.", "Sardor M.", "Kamola N.", "Otabek Y.", "Zarina H."];
const CHRONIC = Array.from({ length: 8 }, (_, i) => ({ name: NAMES[i], grade: 1 + Math.floor(rng(i * 7 + 1) * 11), days: 10 + Math.floor(rng(i * 4 + 2) * 9), reason: ["Sabab noaniq", "Oilaviy", "Kasallik", "Ish"][Math.floor(rng(i * 3 + 5) * 4)] }));
const RISK = [["Kam ta'minlangan oila", 86, T.amber], ["Yetim / vasiylik", 9, T.teal], ["Nogironligi bor", 14, T.gold]];
// HEX bloklar — "tirik mahalla"
const HEX = [
  ["Markaziy", 99, 0], ["Bog'", 98, 1], ["Maktab-12", 99, 0], ["Bozor", 88, 5],
  ["Sanoat", 79, 9], ["Yangi daha", 95, 2], ["Maktab-47", 99, 0], ["Chekka", 84, 6],
  ["Park", 97, 1], ["Stadion", 96, 1], ["Tibbiyot", 98, 0], ["Eski mahalla", 82, 7],
].map(([name, cov, out]) => ({ name, cov, out }));
// MILLIY — real
const NAT = {
  total: 6776300, teachers: 564900, firstGrade: 726231, online: 209280, graduates: 455200, privateS: 112093, shift: 75.5,
  history: [["1990/91", 4655.5], ["2000/01", 6017.6], ["2010/11", 4695.3], ["2020/21", 6287.9], ["2023/24", 6645.1], ["2024/25", 6776.3]],
  regions: [["Samarqand", 720], ["Farg'ona", 690], ["Qashqadaryo", 680], ["Surxondaryo", 560], ["Andijon", 560], ["Toshkent sh.", 550], ["Toshkent vil.", 540], ["Namangan", 540], ["Buxoro", 410], ["Qoraqalpog'iston", 420], ["Xorazm", 400], ["Jizzax", 300], ["Navoiy", 230], ["Sirdaryo", 200]],
};

/* ───────── Scoped CSS ───────── */
const CSS = `
.tcc{--g:${T.gold};font-family:Inter,system-ui,sans-serif;color:${T.text};background:${T.bg};min-height:100%;position:relative;overflow:hidden}
.tcc::before{content:"";position:absolute;inset:0;pointer-events:none;background:
 radial-gradient(900px 500px at 18% -8%, rgba(224,169,59,.10), transparent 60%),
 radial-gradient(800px 600px at 95% 10%, rgba(45,212,191,.08), transparent 60%),
 radial-gradient(700px 500px at 50% 120%, rgba(255,77,77,.06), transparent 60%)}
.tcc::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;
 background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);
 background-size:38px 38px;animation:tccGrid 40s linear infinite}
@keyframes tccGrid{to{background-position:38px 38px}}
.tcc h1,.tcc h2,.tcc h3,.tcc .ttl{font-family:"Space Grotesk",Inter,sans-serif}
.tcc .mono{font-family:"JetBrains Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}
.tcc *{box-sizing:border-box}
.tcc-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;padding:12px 20px;flex-wrap:wrap;
 background:rgba(10,17,25,.72);backdrop-filter:blur(12px);border-bottom:1px solid ${T.border};
 transform:translateY(-100%);animation:tccDrop .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tccDrop{to{transform:translateY(0)}}
.tcc-emb{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,${T.gold},#7a5414);display:grid;place-items:center;font-weight:800;color:#1a1205;font-family:"Space Grotesk";box-shadow:0 0 18px rgba(224,169,59,.4)}
.tcc-top .nm{font-weight:700;font-size:15px;font-family:"Space Grotesk";letter-spacing:.3px}
.tcc-top .sb{font-size:11px;color:${T.muted}}
.tcc-seg{display:inline-flex;background:rgba(255,255,255,.05);border:1px solid ${T.border};border-radius:999px;padding:3px}
.tcc-seg button{border:0;background:transparent;color:${T.muted};font-weight:600;font-size:12px;padding:6px 15px;border-radius:999px;cursor:pointer}
.tcc-seg button[aria-pressed=true]{background:${T.gold};color:#1a1205}
.tcc-sel{background:rgba(255,255,255,.05);color:${T.text};border:1px solid ${T.border};border-radius:8px;padding:6px 10px;font-size:12px}
.tcc-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:${T.teal}}
.tcc-live i{width:7px;height:7px;border-radius:50%;background:${T.teal};box-shadow:0 0 8px ${T.teal};animation:tccPulse 1.4s ease-in-out infinite}
@keyframes tccPulse{50%{opacity:.3;transform:scale(.7)}}
.tcc-wrap{position:relative;z-index:1;padding:18px 20px;max-width:1560px;margin:0 auto}
.tcc-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
.tcc-card{background:linear-gradient(180deg,rgba(15,26,36,.82),rgba(12,21,30,.82));border:1px solid ${T.border};border-radius:16px;padding:14px 16px;
 box-shadow:0 1px 0 rgba(255,255,255,.03) inset,0 18px 40px -24px rgba(0,0,0,.9);backdrop-filter:blur(8px);display:flex;flex-direction:column;min-width:0;
 opacity:0;transform:translateY(16px);animation:tccUp .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tccUp{to{opacity:1;transform:translateY(0)}}
.tcc-card .hd{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:10px}
.tcc-card .hd .t{font-weight:700;font-size:13.5px;font-family:"Space Grotesk";color:${T.text}}
.tcc-card .hd .s{font-size:11px;color:${T.muted}}
.tcc-exp{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:28px;height:28px;display:grid;place-items:center;cursor:pointer;color:${T.muted};flex:0 0 auto}
.tcc-exp:hover{color:${T.text};border-color:${T.gold}}
.tcc-ch{flex:1;min-height:200px}
.tcc-note{font-size:11px;color:${T.muted};margin-top:8px}
.tcc-pill{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(224,169,59,.14);color:${T.gold}}
.tcc-pill.real{background:rgba(47,191,135,.14);color:${T.green}}
/* HERO */
.tcc-hero{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:14px;margin-bottom:14px}
.tcc-alarm{grid-column:span 1;background:radial-gradient(120% 120% at 30% 0%,rgba(255,77,77,.18),rgba(15,26,36,.85));border:1px solid rgba(255,77,77,.35);border-radius:18px;padding:16px 18px;position:relative;overflow:hidden}
.tcc-alarm .big{font-family:"JetBrains Mono";font-size:64px;font-weight:700;line-height:1;color:${T.alarm};text-shadow:0 0 26px rgba(255,77,77,.6);animation:tccGlow 2.6s ease-in-out infinite}
@keyframes tccGlow{50%{text-shadow:0 0 40px rgba(255,77,77,.9)}}
.tcc-kpi{background:rgba(15,26,36,.8);border:1px solid ${T.border};border-radius:16px;padding:14px 16px}
.tcc-kpi .lab{font-size:11px;color:${T.muted};font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.tcc-kpi .val{font-family:"JetBrains Mono";font-size:30px;font-weight:700;margin-top:6px}
.tcc-tbl{width:100%;border-collapse:collapse;font-size:12.5px}
.tcc-tbl th{text-align:left;color:${T.muted};font-weight:600;font-size:10.5px;text-transform:uppercase;padding:7px 6px;border-bottom:1px solid ${T.border}}
.tcc-tbl td{padding:8px 6px;border-bottom:1px solid rgba(255,255,255,.05)}
.tcc-bar{height:6px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden}
.tcc-bar>i{display:block;height:100%;border-radius:99px}
.tcc-c3{grid-column:span 3}.tcc-c4{grid-column:span 4}.tcc-c5{grid-column:span 5}.tcc-c6{grid-column:span 6}.tcc-c7{grid-column:span 7}.tcc-c8{grid-column:span 8}.tcc-c12{grid-column:span 12}
.tcc-modal{position:fixed;inset:0;z-index:80;background:rgba(5,10,15,.7);display:grid;place-items:center;padding:18px;backdrop-filter:blur(4px);animation:tccFade .2s ease}
@keyframes tccFade{from{opacity:0}}
.tcc-mbox{background:${T.panel};border:1px solid ${T.border};border-radius:18px;width:min(1100px,96vw);height:min(82vh,820px);display:flex;flex-direction:column;padding:16px 18px;box-shadow:0 40px 100px rgba(0,0,0,.7);
 transform:scale(.92);opacity:0;animation:tccGrow .28s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tccGrow{to{transform:scale(1);opacity:1}}
.tcc-mbox .mc{flex:1;min-height:0}
.tcc-x{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:34px;height:34px;cursor:pointer;color:${T.text};font-size:18px}
.tcc a:focus-visible,.tcc button:focus-visible,.tcc select:focus-visible{outline:3px solid ${T.gold};outline-offset:2px;border-radius:8px}
.hex{transition:transform .18s ease,filter .18s ease;cursor:pointer;transform-box:fill-box;transform-origin:center}
.hex:hover{transform:scale(1.12);filter:brightness(1.25)}
@media(max-width:1100px){.tcc-hero{grid-template-columns:repeat(2,1fr)}.tcc-c4,.tcc-c5,.tcc-c6,.tcc-c7,.tcc-c8{grid-column:span 12}.tcc-c3{grid-column:span 6}}
@media(max-width:640px){.tcc-hero{grid-template-columns:1fr}.tcc-c3{grid-column:span 12}.tcc-alarm .big{font-size:52px}}
@media(prefers-reduced-motion:reduce){.tcc *,.tcc::after{animation:none!important;transition:none!important}.tcc-card,.tcc-top,.tcc-mbox{opacity:1!important;transform:none!important}}
`;

/* ───────── Count-up ───────── */
function useCountUp(target, dur = 1300) {
  const [v, setV] = useState(reduced ? target : 0);
  useEffect(() => {
    if (reduced) { setV(target); return; }
    let raf; const t0 = performance.now();
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setV(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

/* ───────── ECharts panel (+ silliq kengayuvchi modal) ───────── */
function EPanel({ title, subtitle, note, option, className = "tcc-c6", delay = 0, height = 240 }) {
  const ref = useRef(null), inst = useRef(null);
  const mref = useRef(null), minst = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!ref.current) return; inst.current = echarts.init(ref.current, null, { renderer: "canvas" });
    inst.current.setOption(option);
    const ro = () => inst.current && inst.current.resize(); window.addEventListener("resize", ro);
    return () => { window.removeEventListener("resize", ro); inst.current && inst.current.dispose(); };
  }, []);
  useEffect(() => { inst.current && inst.current.setOption(option, true); }, [option]);
  useEffect(() => {
    if (!open || !mref.current) return; minst.current = echarts.init(mref.current);
    minst.current.setOption(option); const ro = () => minst.current && minst.current.resize();
    window.addEventListener("resize", ro); const tmo = setTimeout(() => minst.current && minst.current.resize(), 60);
    const onKey = (e) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", onKey);
    return () => { clearTimeout(tmo); window.removeEventListener("resize", ro); window.removeEventListener("keydown", onKey); minst.current && minst.current.dispose(); };
  }, [open]);
  return (
    <div className={`tcc-card ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="hd"><div><div className="t">{title}</div>{subtitle && <div className="s">{subtitle}</div>}</div>
        <button className="tcc-exp" aria-label={`${title} — kengaytirish`} title="Kengaytirish" onClick={() => setOpen(true)}>⤢</button></div>
      <div className="tcc-ch" ref={ref} style={{ height }} />
      {note && <div className="tcc-note">{note}</div>}
      {open && (
        <div className="tcc-modal" role="dialog" aria-modal="true" aria-label={title} onClick={() => setOpen(false)}>
          <div className="tcc-mbox" onClick={(e) => e.stopPropagation()}>
            <div className="hd"><div><div className="t" style={{ fontSize: 16 }}>{title}</div><div className="s">{subtitle} · Esc — yopish</div></div><button className="tcc-x" aria-label="Yopish" onClick={() => setOpen(false)}>×</button></div>
            <div className="mc" ref={mref} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Generic glass card (jadval / hex) ───────── */
function Card({ title, subtitle, note, className = "tcc-c6", delay = 0, children }) {
  return (
    <div className={`tcc-card ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="hd"><div><div className="t">{title}</div>{subtitle && <div className="s">{subtitle}</div>}</div></div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
      {note && <div className="tcc-note">{note}</div>}
    </div>
  );
}

/* ───────── Hex-grid "tirik mahalla" ───────── */
function HexGrid() {
  const [hover, setHover] = useState(null);
  const s = 34, w = s * 1.5, h = Math.sqrt(3) * s; // flat-top
  const cols = 4;
  const covColor = (c) => (c >= 97 ? T.green : c >= 92 ? T.teal : c >= 85 ? T.gold : T.alarm);
  const hexPath = (cx, cy) => Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 180) * (60 * i); return `${(cx + s * Math.cos(a)).toFixed(1)},${(cy + s * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const W = 4 * w + s, H = 3 * h + s + 20;
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="Mahalla bloklari qamrovi">
        {HEX.map((b, i) => {
          const col = i % cols, row = Math.floor(i / cols);
          const cx = s + col * w + 4, cy = s + 10 + row * h + (col % 2 ? h / 2 : 0);
          const c = covColor(b.cov);
          return (
            <g key={b.name} className="hex" onMouseEnter={() => setHover(b)} onMouseLeave={() => setHover(null)} tabIndex={0} onFocus={() => setHover(b)} onBlur={() => setHover(null)}>
              <polygon points={hexPath(cx, cy)} fill={c} fillOpacity={b.out > 0 ? 0.85 : 0.55} stroke={c} strokeWidth="1.5" style={{ filter: b.cov < 85 ? `drop-shadow(0 0 6px ${c})` : "none" }} />
              <text x={cx} y={cy - 2} textAnchor="middle" fontSize="8.5" fill="#06121a" fontWeight="700" style={{ pointerEvents: "none" }}>{b.cov}%</text>
              {b.out > 0 && <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill="#1a0606" fontWeight="700" style={{ pointerEvents: "none" }}>⚠{b.out}</text>}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 8, bottom: 4, fontSize: 11, color: T.muted }}>
        {hover ? <span><b style={{ color: T.text }}>{hover.name}</b> · qamrov {hover.cov}% · chetda {hover.out}</span> : "Blok ustiga olib boring"}
      </div>
    </div>
  );
}

/* ───────── ECharts opsiyalari ───────── */
const baseGrid = { left: 8, right: 14, top: 18, bottom: 22, containLabel: true };
const axisStyle = { axisLine: { lineStyle: { color: "rgba(255,255,255,.14)" } }, axisLabel: { color: T.muted, fontSize: 10 }, splitLine: { lineStyle: { color: "rgba(255,255,255,.05)" } } };

const TalimDashboardPage = () => {
  const [view, setView] = useState("mahalla");
  const [days, setDays] = useState(14);
  const milliy = view === "milliy";

  useEffect(() => { if (!document.getElementById("tcc-style")) { const st = document.createElement("style"); st.id = "tcc-style"; st.textContent = CSS; document.head.appendChild(st); } }, []);
  useEffect(() => { if (!document.getElementById("tcc-fonts")) { const l = document.createElement("link"); l.id = "tcc-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"; document.head.appendChild(l); } }, []);

  const outCount = useCountUp(M.outOfSchool);
  const coverage = useCountUp(+(((M.children6_18 - M.outOfSchool) / M.children6_18) * 100).toFixed(1), 1500);
  const totalKids = useCountUp(M.children6_18, 1500);
  const chronic = useCountUp(M.chronic);

  /* Sankey */
  const sankey = useMemo(() => {
    const red = { itemStyle: { color: T.alarm }, label: { color: T.alarm } };
    return {
      backgroundColor: "transparent",
      tooltip: { trigger: "item", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text, fontSize: 12 } },
      series: [{
        type: "sankey", left: 6, right: 130, top: 12, bottom: 12, nodeWidth: 13, nodeGap: 13,
        emphasis: { focus: "adjacency" }, draggable: false,
        label: { color: T.text, fontFamily: "Inter", fontSize: 11 },
        lineStyle: { color: "gradient", curveness: .5, opacity: .42 },
        data: [
          { name: "Bolalar 6–18", itemStyle: { color: T.gold } },
          { name: "Maktabda o'qiyapti", itemStyle: { color: T.green } },
          { name: "Maktabgacha tayyorlov", itemStyle: { color: T.teal } },
          { name: "⚠ Chetda qolgan", ...red },
          { name: "9-sinfni tugatdi", itemStyle: { color: T.gold } },
          { name: "10-sinf (akademik)", itemStyle: { color: T.green } },
          { name: "Kollej / texnikum", itemStyle: { color: T.teal } },
          { name: "⚠ Hech qayerda", ...red },
        ],
        links: [
          { source: "Bolalar 6–18", target: "Maktabda o'qiyapti", value: 2540 },
          { source: "Bolalar 6–18", target: "Maktabgacha tayyorlov", value: 109 },
          { source: "Bolalar 6–18", target: "⚠ Chetda qolgan", value: 31, lineStyle: { color: T.alarm, opacity: .65 } },
          { source: "Maktabda o'qiyapti", target: "9-sinfni tugatdi", value: 224 },
          { source: "9-sinfni tugatdi", target: "10-sinf (akademik)", value: 150 },
          { source: "9-sinfni tugatdi", target: "Kollej / texnikum", value: 65 },
          { source: "9-sinfni tugatdi", target: "⚠ Hech qayerda", value: 9, lineStyle: { color: T.alarm, opacity: .65 } },
        ],
      }],
    };
  }, []);

  /* Qamrov radari (konsentrik gauge) */
  const radar = useMemo(() => {
    const rings = [["9-dan keyin", 96, T.gold], ["O'rta", 97, T.teal], ["Boshlang'ich", 99, T.green], ["Maktabgacha", 78, T.amber]];
    return {
      backgroundColor: "transparent",
      series: rings.map((r, i) => ({
        type: "gauge", startAngle: 90, endAngle: -270, radius: `${92 - i * 18}%`, center: ["50%", "52%"],
        pointer: { show: false }, progress: { show: true, roundCap: true, width: 8, itemStyle: { color: r[2] } },
        axisLine: { lineStyle: { width: 8, color: [[1, "rgba(255,255,255,.06)"]] } },
        splitLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false },
        data: [{ value: r[1] }], detail: { show: false },
      })),
    };
  }, []);

  /* Davomat trendi */
  const trend = useMemo(() => {
    const sl = TREND.slice(30 - days);
    return {
      backgroundColor: "transparent", grid: baseGrid,
      tooltip: { trigger: "axis", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } },
      xAxis: { type: "category", data: sl.map((t) => t.d), ...axisStyle },
      yAxis: { type: "value", min: 85, max: 100, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, formatter: "{value}%" } },
      series: [{ type: "line", smooth: true, data: sl.map((t) => t.v), symbol: "circle", symbolSize: 5, lineStyle: { color: T.teal, width: 2.4, shadowColor: T.teal, shadowBlur: 12 }, itemStyle: { color: T.teal }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(45,212,191,.35)" }, { offset: 1, color: "rgba(45,212,191,0)" }]) } }],
    };
  }, [days]);

  /* Qizlar kesimi */
  const girls = useMemo(() => ({
    backgroundColor: "transparent",
    tooltip: { trigger: "item", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } },
    series: [{ type: "pie", radius: ["58%", "78%"], center: ["50%", "48%"], label: { show: false }, data: [
      { value: 1231, name: "Qamrovda", itemStyle: { color: T.green } },
      { value: 14, name: "Chetda qolgan qiz", itemStyle: { color: T.alarm } },
    ] }],
  }), []);

  /* Dinamika 1990–2025 */
  const dynamics = useMemo(() => ({
    backgroundColor: "transparent", grid: baseGrid,
    tooltip: { trigger: "axis", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } },
    xAxis: { type: "category", data: NAT.history.map((h) => h[0]), ...axisStyle },
    yAxis: { type: "value", ...axisStyle },
    series: [{ type: "line", smooth: true, data: NAT.history.map((h) => h[1]), symbol: "circle", symbolSize: 6, lineStyle: { color: T.gold, width: 2.4 }, itemStyle: { color: T.gold }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(224,169,59,.3)" }, { offset: 1, color: "rgba(224,169,59,0)" }]) } }],
  }), []);

  /* Hududlar */
  const regions = useMemo(() => ({
    backgroundColor: "transparent", grid: { ...baseGrid, left: 70 },
    tooltip: { trigger: "axis", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } },
    xAxis: { type: "value", ...axisStyle },
    yAxis: { type: "category", data: NAT.regions.map((r) => r[0]).reverse(), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, fontSize: 9 } },
    series: [{ type: "bar", data: NAT.regions.map((r) => r[1]).reverse(), itemStyle: { color: T.gold, borderRadius: [0, 4, 4, 0] }, barWidth: "62%" }],
  }), []);

  /* Sinflar */
  const classesOpt = useMemo(() => ({
    backgroundColor: "transparent", grid: baseGrid,
    tooltip: { trigger: "axis", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } },
    xAxis: { type: "category", data: CLASSES.map((c) => c.g), ...axisStyle },
    yAxis: { type: "value", min: 80, max: 100, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, formatter: "{value}%" } },
    series: [{ type: "bar", data: CLASSES.map((c) => ({ value: c.v, itemStyle: { color: c.v >= 94 ? T.green : c.v >= 90 ? T.gold : T.amber, borderRadius: [4, 4, 0, 0] } })), barWidth: "58%" }],
  }), []);

  const kpisMilliy = [["Jami o'quvchi", fmt(NAT.total)], ["O'qituvchilar", fmt(NAT.teachers)], ["1-sinf qabul", fmt(NAT.firstGrade)]];

  return (
    <div className="tcc">
      {/* TOPBAR */}
      <div className="tcc-top">
        <div className="tcc-emb">UT</div>
        <div style={{ marginRight: "auto" }}><div className="nm">Mahalla Ta'lim Komandavoy Markazi</div><div className="sb">{M.name} · {M.area}</div></div>
        <span className="tcc-live"><i /> JONLI</span>
        <div className="tcc-seg" role="group" aria-label="Ko'rinish"><button aria-pressed={!milliy} onClick={() => setView("mahalla")}>Mahalla</button><button aria-pressed={milliy} onClick={() => setView("milliy")}>Milliy</button></div>
        <select className="tcc-sel" value={days} onChange={(e) => setDays(+e.target.value)} aria-label="Sana filtri"><option value={7}>7 kun</option><option value={14}>14 kun</option><option value={30}>30 kun</option></select>
        <div className="sb mono">24.06.2026</div>
      </div>

      <div className="tcc-wrap">
        {/* HERO */}
        <div className="tcc-hero">
          <div className="tcc-alarm">
            <div style={{ fontSize: 11, color: "#ffb3b3", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px" }}>⚠ Ta'limdan chetda qolgan bolalar</div>
            <div className="big">{fmt(milliy ? 0 : outCount)}</div>
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 6 }}>{milliy ? "Milliy kesim — mahalla darajasida hisoblanadi" : "6–18 yosh · ish 12 · kasallik 7 · noaniq 9 · ko'chgan 3"}</div>
          </div>
          {milliy
            ? kpisMilliy.map(([l, v], i) => <div className="tcc-kpi" key={i}><div className="lab">{l}</div><div className="val" style={{ color: T.text }}>{v}</div></div>)
            : [["Umumiy qamrov", `${coverage.toFixed(1)}%`, T.green], ["Jami bola (6–18)", fmt(totalKids), T.text], ["Surunkali kelmaydigan", fmt(chronic), T.amber]].map(([l, v, c], i) => (
              <div className="tcc-kpi" key={i}><div className="lab">{l}</div><div className="val" style={{ color: c }}>{v}</div></div>
            ))}
        </div>

        {/* MARKAZ */}
        <div className="tcc-grid" style={{ marginBottom: 14 }}>
          <EPanel className="tcc-c8" delay={120} height={360} title="Bola qayoqqa ketadi — oqim" subtitle="6–18 yosh · maktab → 9-sinfdan keyin" option={sankey}
            note={<span><span className="tcc-pill">namunaviy</span> &nbsp;Qizil tarmoqlar — chetda qolgan / hech qayerda</span>} />
          <Card className="tcc-c4" delay={220} title="Tirik mahalla — qamrov" subtitle="Bloklar (hex)" note={<span className="tcc-pill">namunaviy · qizil = past qamrov</span>}><HexGrid /></Card>
        </div>

        {/* QO'LLAB-QUVVATLOVCHI */}
        <div className="tcc-grid">
          <EPanel className="tcc-c4" delay={260} title="Qamrov radari" subtitle="Maktabgacha → 9-dan keyin" option={radar} height={230}
            note="Maktabgacha 78% · Boshlang'ich 99% · O'rta 97% · 9-dan keyin 96%" />
          <EPanel className="tcc-c8" delay={300} title="Davomat tendentsiyasi" subtitle={`Oxirgi ${days} kun`} option={trend} height={230} note={<span className="tcc-pill">namunaviy</span>} />

          <Card className="tcc-c7" delay={340} title="Surunkali kelmaydiganlar" subtitle="Oyda 10+ kun qoldirganlar" note={<span className="tcc-pill">namunaviy · jami {M.chronic}</span>}>
            <table className="tcc-tbl"><thead><tr><th>F.I.O</th><th>Sinf</th><th>Sabab</th><th style={{ textAlign: "right" }}>Qoldirgan kun</th></tr></thead>
              <tbody>{CHRONIC.map((c, i) => <tr key={i}><td style={{ fontWeight: 600 }}>{c.name}</td><td className="mono">{c.grade}</td><td style={{ color: T.muted }}>{c.reason}</td><td style={{ textAlign: "right" }} className="mono"><span style={{ color: c.days >= 15 ? T.alarm : T.amber, fontWeight: 700 }}>{c.days}</span></td></tr>)}</tbody>
            </table>
          </Card>

          <Card className="tcc-c5" delay={380} title="Xavf guruhlari" subtitle="Maxsus e'tibor talab qiladi" note={<span className="tcc-pill">namunaviy</span>}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              {RISK.map(([l, n, c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: `1px solid ${T.border}`, borderRadius: 12, background: "rgba(255,255,255,.02)" }}>
                  <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: c, minWidth: 54 }}>{fmt(n)}</div>
                  <div style={{ fontSize: 12.5 }}>{l}<div style={{ fontSize: 10.5, color: T.muted }}>bolalar</div></div>
                </div>
              ))}
            </div>
          </Card>

          <EPanel className="tcc-c4" delay={420} title="Qizlar bo'yicha kesim" subtitle="Erta nikoh xavfi monitoringi" option={girls} height={200}
            note={<span><span className="tcc-pill">namunaviy</span> &nbsp;Qizlar 1245 · qamrov 98.9% · chetda 14</span>} />
          <EPanel className="tcc-c8" delay={460} title="Sinflar bo'yicha davomat" subtitle="1–11-sinf" option={classesOpt} height={200} note={<span className="tcc-pill">namunaviy</span>} />

          {/* Maktablar */}
          <Card className="tcc-c5" delay={500} title="Mahalladagi maktablar" subtitle={M.name} note={<span className="tcc-pill">namunaviy</span>}>
            <table className="tcc-tbl"><thead><tr><th>Maktab</th><th>Smena</th><th style={{ textAlign: "right" }}>O'quvchi</th><th>Qamrov</th></tr></thead>
              <tbody>{SCHOOLS.map((s) => <tr key={s.name}><td style={{ fontWeight: 600 }}>{s.name}<div style={{ fontSize: 10, color: T.muted }}>{s.type}</div></td><td style={{ color: T.muted }}>{s.shift}</td><td style={{ textAlign: "right" }} className="mono">{fmt(s.students)}</td><td><div style={{ display: "flex", alignItems: "center", gap: 6 }}><div className="tcc-bar" style={{ flex: 1 }}><i style={{ width: `${s.cov}%`, background: T.green }} /></div><span className="mono" style={{ fontSize: 11 }}>{s.cov}%</span></div></td></tr>)}</tbody>
            </table>
          </Card>

          {/* Milliy + solishtirma */}
          <Card className="tcc-c7" delay={540} title="Milliy ko'rsatkichlar va solishtirma" subtitle="O'zbekiston umumiy ta'limi (real)" note={<span className="tcc-pill real">real · manbalar: Xabar, Anhor, Daryo, Kun.uz, Kursiv</span>}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[["Jami o'quvchi", fmt(NAT.total)], ["O'qituvchilar", fmt(NAT.teachers)], ["1-sinf qabul", fmt(NAT.firstGrade)], ["Onlayn qabul", fmt(NAT.online)], ["Bitiruvchilar", fmt(NAT.graduates)], ["Xususiyda", fmt(NAT.privateS)]].map(([l, v]) => (
                <div key={l} style={{ border: `1px solid ${T.border}`, borderRadius: 11, padding: "10px 12px", background: "rgba(255,255,255,.02)" }}><div className="mono" style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{v}</div><div style={{ fontSize: 10.5, color: T.muted }}>{l}</div></div>
              ))}
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180, border: `1px solid ${T.border}`, borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.muted }}>Qamrov: Mahalla vs Respublika</div>
                <div style={{ marginTop: 8 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span>Navbahor MFY</span><span className="mono" style={{ color: T.green }}>98.8%</span></div><div className="tcc-bar" style={{ marginTop: 4 }}><i style={{ width: "98.8%", background: T.green }} /></div></div>
                <div style={{ marginTop: 8 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span>Respublika (taxm.)</span><span className="mono" style={{ color: T.teal }}>98.0%</span></div><div className="tcc-bar" style={{ marginTop: 4 }}><i style={{ width: "98%", background: T.teal }} /></div></div>
              </div>
              <div style={{ flex: 1, minWidth: 180, border: `1px solid ${T.border}`, borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.muted }}>Eng kam bitiruvchi (real)</div>
                <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.7 }}>Sirdaryo <b className="mono">11 000</b> · Navoiy <b className="mono">13 000</b> · Jizzax <b className="mono">18 000</b></div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>2–3 smena: <b className="mono" style={{ color: T.amber }}>{NAT.shift}%</b></div>
              </div>
            </div>
          </Card>

          <EPanel className="tcc-c7" delay={580} title="O'quvchilar soni dinamikasi" subtitle="1990–2025 (ming)" option={dynamics} height={220} note={<span className="tcc-pill real">real</span>} />
          <EPanel className="tcc-c5" delay={620} title="Hududlar bo'yicha taqsimot" subtitle="O'quvchilar (ming)" option={regions} height={300} note={<span className="tcc-pill">taxminiy taqsimot</span>} />
        </div>

        <div style={{ marginTop: 16, fontSize: 11.5, color: T.muted }}>Mahalla raqamlari — <b>namunaviy (sintetik)</b>. Milliy raqamlar — manbalar asosida real.</div>
      </div>
    </div>
  );
};

export default TalimDashboardPage;
