// Mahalla Ta'lim KOMANDAVOY MARKAZI — faqat bitta mahalla ichki tizimi (milliy/hududiy yo'q).
// Sankey + hex-grid + count-up + frosted glass. Yangi: 3 qatlamli "Umumiy ma'lumotlar"
// (muassasa kartalari → drill-down · O'quvchilar filtrli ro'yxat · Hodimlar). Barchasi namunaviy.
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as echarts from "echarts";

/* ───────── Tokenlar ───────── */
const T = { bg: "#0A1119", panel: "#0F1A24", border: "#1E2D3D", gold: "#E0A93B", teal: "#2DD4BF", green: "#2FBF87", amber: "#E0A93B", red: "#E5484D", alarm: "#FF4D4D", text: "#E8EEF3", muted: "#7C8B99" };
const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = (n) => Math.round(n).toLocaleString("uz-UZ").replace(/,/g, " ");
const rng = (s) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

/* ───────── Mahalla namunaviy ma'lumotlari ───────── */
const M = { name: "Navbahor MFY", area: "Yunusobod tumani, Toshkent", children6_18: 2680, inSchool: 2540, outOfSchool: 31, preschool: 78, chronic: 24, present: 2392, excused: 89, absent: 59 };
const SCHOOL_NAMES = ["12-maktab", "47-maktab", "Bilim xususiy maktabi"];
const dayLabel = (b) => { const d = new Date(2026, 5, 24); d.setDate(d.getDate() - b); return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`; };
const trend30 = (seed) => Array.from({ length: 30 }, (_, i) => +(90 + rng(i * 3 + seed) * 7).toFixed(1));
const classDist = (total, seed) => { const base = Array.from({ length: 11 }, (_, i) => 0.7 + rng(i + seed) * 0.6); const sum = base.reduce((a, b) => a + b, 0); return base.map((b) => Math.round((b / sum) * total)); };

const INST = [
  { id: "davlat", title: "Bizdagi maktab", sub: "Davlat maktablari", kind: "school", schools: ["12-maktab (2-smena)", "47-maktab (1-smena)"], count: 2, students: 2220, attendance: 94.6, boys: 1154, girls: 1066, chronic: 21, accent: T.teal, trend: trend30(2), dist: classDist(2220, 5) },
  { id: "xususiy", title: "Xususiy maktab", sub: "Bilim xususiy maktabi", kind: "school", schools: ["Bilim xususiy maktabi"], count: 1, students: 320, attendance: 96.4, boys: 166, girls: 154, chronic: 3, accent: T.gold, trend: trend30(7), dist: classDist(320, 9) },
  { id: "bogcha", title: "Bog'cha", sub: "Maktabgacha ta'lim · Navbahor 14-DMTT", kind: "kg", schools: ["Navbahor 14-DMTT"], count: 1, students: 180, attendance: 92.1, boys: 94, girls: 86, chronic: 5, accent: T.green, trend: trend30(4), groups: [["3–4 yosh", 54], ["4–5 yosh", 62], ["5–6 yosh", 64]] },
];

/* O'quvchilar (namunaviy ro'yxat) */
const LAST = ["Azizov", "Karimov", "Rasulov", "Tursunov", "Yusupov", "Aliyev", "Saidov", "Qodirov", "Ergashev", "Olimov", "Nazarov", "Sobirov", "Hasanov", "Umarov", "Jo'rayev", "Mirzayev", "To'xtasinov", "Islomov"];
const FIRST_M = ["Jasur", "Aziz", "Bekzod", "Sardor", "Otabek", "Akmal", "Bobur", "Sanjar", "Rustam", "Islom", "Diyor", "Davron", "Eldor", "Shoxruh", "Jahongir"];
const FIRST_F = ["Madina", "Nilufar", "Dilnoza", "Malika", "Zarina", "Kamola", "Nodira", "Sevara", "Gulnoza", "Shahzoda", "Maftuna", "Dildora", "Ozoda", "Mohira", "Feruza"];
const SCHOOLS3 = ["12-maktab", "47-maktab", "Bilim xususiy maktabi"];
const STUDENTS = Array.from({ length: 76 }, (_, i) => {
  const female = rng(i * 1.7 + 1) < 0.48;
  const last = LAST[Math.floor(rng(i * 2.3) * LAST.length)];
  const first = female ? FIRST_F[Math.floor(rng(i * 3.1 + 2) * FIRST_F.length)] : FIRST_M[Math.floor(rng(i * 3.1 + 2) * FIRST_M.length)];
  const grade = 1 + Math.floor(rng(i * 4.7 + 3) * 11);
  const att = +(82 + rng(i * 5.9 + 4) * 17).toFixed(1);
  const inst = SCHOOLS3[rng(i * 6.3 + 5) < 0.86 ? Math.floor(rng(i * 7.1) * 2) : 2];
  return { id: `s${i}`, name: `${last}${female ? "a" : ""} ${first}`, gender: female ? "qiz" : "o'g'il", grade, age: grade + 6, att, status: att < 90 ? "qoldiruvchi" : "doimiy", inst };
});

/* Hodimlar (namunaviy) */
const SUBJECTS = ["Matematika", "Ona tili", "Ingliz tili", "Fizika", "Tarix", "Kimyo", "Biologiya", "Geografiya", "Informatika", "Jismoniy tarbiya", "Musiqa", "Chizmachilik"];
const STAFF = [
  { id: "h1", name: "Yusupov Bahodir", role: "Direktor", subject: "—", exp: 22, inst: "12-maktab" },
  { id: "h2", name: "Karimova Dilfuza", role: "O'rinbosar", subject: "Ta'lim ishlari", exp: 17, inst: "12-maktab" },
  { id: "h3", name: "Sobirov Akmal", role: "O'rinbosar", subject: "Ma'naviyat", exp: 14, inst: "47-maktab" },
  ...SUBJECTS.map((s, i) => ({ id: `t${i}`, name: `${LAST[(i + 2) % LAST.length]}${i % 2 ? "a" : ""} ${(i % 2 ? FIRST_F : FIRST_M)[(i + 3) % 15]}`, role: "O'qituvchi", subject: s, exp: 3 + Math.floor(rng(i * 9 + 1) * 28), inst: SCHOOLS3[Math.floor(rng(i * 4 + 2) * 3)] })),
  { id: "p1", name: "Aliyeva Nodira", role: "Boshqa", subject: "Psixolog", exp: 8, inst: "12-maktab" },
  { id: "p2", name: "Rasulova Sevara", role: "Boshqa", subject: "Kutubxonachi", exp: 11, inst: "47-maktab" },
  { id: "p3", name: "Olimova Kamola", role: "Boshqa", subject: "Hamshira", exp: 6, inst: "12-maktab" },
  { id: "p4", name: "Nazarov Eldor", role: "Boshqa", subject: "Qorovul", exp: 9, inst: "12-maktab" },
  { id: "p5", name: "Hasanov Diyor", role: "Boshqa", subject: "Qorovul", exp: 4, inst: "47-maktab" },
  { id: "p6", name: "Umarova Ozoda", role: "Boshqa", subject: "Oshpaz", exp: 13, inst: "12-maktab" },
];

/* ───────── CSS ───────── */
const CSS = `
.tcc{--g:${T.gold};font-family:Inter,system-ui,sans-serif;color:${T.text};background:${T.bg};min-height:100%;position:relative;overflow:hidden}
.tcc::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(900px 500px at 18% -8%,rgba(224,169,59,.10),transparent 60%),radial-gradient(800px 600px at 95% 10%,rgba(45,212,191,.08),transparent 60%)}
.tcc::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:38px 38px;animation:tccGrid 40s linear infinite}
@keyframes tccGrid{to{background-position:38px 38px}}
.tcc h1,.tcc h2,.tcc h3,.tcc .ttl{font-family:"Space Grotesk",Inter,sans-serif}
.tcc .mono{font-family:"JetBrains Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}
.tcc *{box-sizing:border-box}
.tcc-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;padding:12px 20px;flex-wrap:wrap;background:rgba(10,17,25,.72);backdrop-filter:blur(12px);border-bottom:1px solid ${T.border};transform:translateY(-100%);animation:tccDrop .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tccDrop{to{transform:translateY(0)}}
.tcc-emb{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,${T.gold},#7a5414);display:grid;place-items:center;font-weight:800;color:#1a1205;font-family:"Space Grotesk";box-shadow:0 0 18px rgba(224,169,59,.4)}
.tcc-top .nm{font-weight:700;font-size:15px;font-family:"Space Grotesk"}.tcc-top .sb{font-size:11px;color:${T.muted}}
.tcc-sel{background:rgba(255,255,255,.05);color:${T.text};border:1px solid ${T.border};border-radius:8px;padding:6px 10px;font-size:12px}
.tcc-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:${T.teal}}
.tcc-live i{width:7px;height:7px;border-radius:50%;background:${T.teal};box-shadow:0 0 8px ${T.teal};animation:tccPulse 1.4s ease-in-out infinite}
@keyframes tccPulse{50%{opacity:.3;transform:scale(.7)}}
.tcc-wrap{position:relative;z-index:1;padding:18px 20px;max-width:1560px;margin:0 auto}
.tcc-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
.tcc-card{background:linear-gradient(180deg,rgba(15,26,36,.82),rgba(12,21,30,.82));border:1px solid ${T.border};border-radius:16px;padding:14px 16px;box-shadow:0 1px 0 rgba(255,255,255,.03) inset,0 18px 40px -24px rgba(0,0,0,.9);backdrop-filter:blur(8px);display:flex;flex-direction:column;min-width:0;opacity:0;transform:translateY(16px);animation:tccUp .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tccUp{to{opacity:1;transform:translateY(0)}}
.tcc-card .hd{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:10px}
.tcc-card .hd .t{font-weight:700;font-size:13.5px;font-family:"Space Grotesk"}.tcc-card .hd .s{font-size:11px;color:${T.muted}}
.tcc-exp{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:28px;height:28px;display:grid;place-items:center;cursor:pointer;color:${T.muted};flex:0 0 auto}
.tcc-exp:hover{color:${T.text};border-color:${T.gold}}
.tcc-ch{width:100%;overflow:hidden;position:relative}
.tcc-note{font-size:11px;color:${T.muted};margin-top:8px}
.tcc-pill{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(224,169,59,.14);color:${T.gold}}
.tcc-hero{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:14px;margin-bottom:14px}
.tcc-alarm{background:radial-gradient(120% 120% at 30% 0%,rgba(255,77,77,.18),rgba(15,26,36,.85));border:1px solid rgba(255,77,77,.35);border-radius:18px;padding:16px 18px;overflow:hidden}
.tcc-alarm .big{font-family:"JetBrains Mono";font-size:64px;font-weight:700;line-height:1;color:${T.alarm};text-shadow:0 0 26px rgba(255,77,77,.6);animation:tccGlow 2.6s ease-in-out infinite}
@keyframes tccGlow{50%{text-shadow:0 0 40px rgba(255,77,77,.9)}}
.tcc-kpi{background:rgba(15,26,36,.8);border:1px solid ${T.border};border-radius:16px;padding:14px 16px}
.tcc-kpi .lab{font-size:11px;color:${T.muted};font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.tcc-kpi .val{font-family:"JetBrains Mono";font-size:30px;font-weight:700;margin-top:6px}
.tcc-h2{font-family:"Space Grotesk";font-size:17px;font-weight:700;margin:28px 0 14px;display:flex;align-items:center;gap:10px}
.tcc-h2::before{content:"";width:4px;height:18px;background:${T.gold};border-radius:2px;box-shadow:0 0 10px ${T.gold}}
.tcc-inst{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.tcc-instc{cursor:pointer;transition:transform .2s,box-shadow .2s,border-color .2s;animation:none;opacity:1;transform:none}
.tcc-instc:hover{transform:translateY(-5px);border-color:rgba(224,169,59,.55);box-shadow:0 26px 54px -22px rgba(224,169,59,.4)}
.tcc-filter{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px}
.tcc-inp{background:rgba(255,255,255,.05);border:1px solid ${T.border};border-radius:8px;color:${T.text};padding:7px 10px;font-size:12.5px;font-family:Inter;outline:none}
.tcc-inp:focus{border-color:${T.gold}}.tcc-inp::placeholder{color:${T.muted}}
.tcc-found{font-family:"JetBrains Mono";font-size:13px;color:${T.teal};font-weight:700}
.tcc-tbl{width:100%!important;min-width:0!important;border-collapse:collapse;font-size:12.5px}
.tcc-tbl thead{background:transparent!important}
.tcc-tbl th{text-align:left!important;color:${T.muted}!important;font-weight:600;font-size:10.5px;text-transform:uppercase;padding:7px 8px!important;border-bottom:1px solid ${T.border}}
.tcc-tbl tbody{border:0!important}.tcc-tbl tbody tr{background:transparent!important}
.tcc-tbl td{padding:8px 8px!important;border-bottom:1px solid rgba(255,255,255,.06)!important;color:${T.text}}
.tcc-srow{cursor:pointer;transition:background .12s}.tcc-srow:hover td{background:rgba(255,255,255,.04)!important}
.tcc-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;white-space:nowrap}
.tcc-staffgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
.tcc-staffc{border:1px solid ${T.border};border-radius:12px;padding:11px 13px;background:rgba(255,255,255,.02);cursor:pointer;transition:.15s}
.tcc-staffc:hover{border-color:rgba(45,212,191,.45);background:rgba(45,212,191,.05);transform:translateY(-2px)}
.tcc-bar{height:6px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden}.tcc-bar>i{display:block;height:100%;border-radius:99px}
.tcc input[type=range]{accent-color:${T.gold};height:4px}
.tcc-modal{position:fixed;inset:0;z-index:99999;background:rgba(5,10,15,.78);display:grid;place-items:center;padding:18px;backdrop-filter:blur(4px);animation:tccFade .2s ease}
@keyframes tccFade{from{opacity:0}}
.tcc-mbox{color:${T.text};font-family:Inter,system-ui,sans-serif;background:${T.panel};border:1px solid ${T.border};border-radius:18px;width:min(1080px,96vw);max-height:88vh;overflow:auto;display:flex;flex-direction:column;padding:18px 20px;box-shadow:0 40px 100px rgba(0,0,0,.7);transform:scale(.92);opacity:0;animation:tccGrow .28s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tccGrow{to{transform:scale(1);opacity:1}}
.tcc-mbox .mc{position:relative}
.tcc-x{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:34px;height:34px;cursor:pointer;color:${T.text};font-size:18px}
.tcc-c3{grid-column:span 3}.tcc-c4{grid-column:span 4}.tcc-c5{grid-column:span 5}.tcc-c6{grid-column:span 6}.tcc-c8{grid-column:span 8}.tcc-c12{grid-column:span 12}
.tcc a:focus-visible,.tcc button:focus-visible,.tcc select:focus-visible,.tcc input:focus-visible{outline:3px solid ${T.gold};outline-offset:2px;border-radius:8px}
.hex{transition:transform .18s,filter .18s;cursor:pointer;transform-box:fill-box;transform-origin:center}.hex:hover{transform:scale(1.12);filter:brightness(1.25)}
@media(max-width:1100px){.tcc-hero{grid-template-columns:repeat(2,1fr)}.tcc-inst{grid-template-columns:1fr}.tcc-c4,.tcc-c5,.tcc-c6,.tcc-c8{grid-column:span 12}.tcc-c3{grid-column:span 6}}
@media(max-width:640px){.tcc-hero{grid-template-columns:1fr}.tcc-c3{grid-column:span 12}}
@media(prefers-reduced-motion:reduce){.tcc *,.tcc::after{animation:none!important;transition:none!important}.tcc-card,.tcc-top,.tcc-mbox{opacity:1!important;transform:none!important}}
`;

/* ───────── Hooks ───────── */
function useCountUp(target, dur = 1300) {
  const [v, setV] = useState(reduced ? target : 0);
  useEffect(() => { if (reduced) { setV(target); return; } let raf; const t0 = performance.now(); const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setV(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [target, dur]);
  return v;
}
function useTween(target, dur = 450) {
  const [v, setV] = useState(target); const from = useRef(target);
  useEffect(() => { if (reduced) { setV(target); from.current = target; return; } const a = from.current, t0 = performance.now(); let raf; const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setV(a + (target - a) * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); else from.current = target; }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [target, dur]);
  return v;
}

/* ───────── ECharts ───────── */
function MiniChart({ option, height = 200 }) {
  const ref = useRef(null), inst = useRef(null);
  useEffect(() => { if (!ref.current) return; inst.current = echarts.init(ref.current); inst.current.setOption(option); const ro = new ResizeObserver(() => inst.current && inst.current.resize()); ro.observe(ref.current); return () => { ro.disconnect(); inst.current && inst.current.dispose(); }; }, []);
  useEffect(() => { inst.current && inst.current.setOption(option, true); }, [option]);
  return <div ref={ref} style={{ width: "100%", height }} />;
}
function EPanel({ title, subtitle, note, option, className = "tcc-c6", delay = 0, height = 240 }) {
  const ref = useRef(null), inst = useRef(null), mref = useRef(null), minst = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!ref.current) return; inst.current = echarts.init(ref.current); inst.current.setOption(option); const ro = new ResizeObserver(() => inst.current && inst.current.resize()); ro.observe(ref.current); return () => { ro.disconnect(); inst.current && inst.current.dispose(); }; }, []);
  useEffect(() => { inst.current && inst.current.setOption(option, true); }, [option]);
  useEffect(() => { if (!open || !mref.current) return; minst.current = echarts.init(mref.current); minst.current.setOption(option); const ro = new ResizeObserver(() => minst.current && minst.current.resize()); ro.observe(mref.current); const onKey = (e) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", onKey); return () => { ro.disconnect(); window.removeEventListener("keydown", onKey); minst.current && minst.current.dispose(); }; }, [open]);
  return (
    <div className={`tcc-card ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="hd"><div><div className="t">{title}</div>{subtitle && <div className="s">{subtitle}</div>}</div><button className="tcc-exp" aria-label={`${title} kengaytirish`} onClick={() => setOpen(true)}>⤢</button></div>
      <div className="tcc-ch" ref={ref} style={{ height }} />
      {note && <div className="tcc-note">{note}</div>}
      {open && createPortal(
        <div className="tcc-modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="tcc-mbox" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}><div><div style={{ fontFamily: '"Space Grotesk",Inter', fontWeight: 700, fontSize: 16 }}>{title}</div><div style={{ fontSize: 11.5, color: T.muted }}>{subtitle} · Esc</div></div><button className="tcc-x" onClick={() => setOpen(false)}>×</button></div>
            <div className="mc" ref={mref} style={{ height: "62vh" }} />
          </div>
        </div>, document.body)}
    </div>
  );
}

/* ───────── HexGrid ───────── */
const HEX = [["Markaziy", 99, 0], ["Bog'", 98, 1], ["Maktab-12", 99, 0], ["Bozor", 88, 5], ["Sanoat", 79, 9], ["Yangi daha", 95, 2], ["Maktab-47", 99, 0], ["Chekka", 84, 6], ["Park", 97, 1], ["Stadion", 96, 1], ["Tibbiyot", 98, 0], ["Eski mahalla", 82, 7]].map(([name, cov, out]) => ({ name, cov, out }));
function HexGrid() {
  const [hv, setHv] = useState(null); const s = 34, w = s * 1.5, h = Math.sqrt(3) * s;
  const col = (c) => (c >= 97 ? T.green : c >= 92 ? T.teal : c >= 85 ? T.gold : T.alarm);
  const pts = (cx, cy) => Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 180) * (60 * i); return `${(cx + s * Math.cos(a)).toFixed(1)},${(cy + s * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const W = 4 * w + s, H = 3 * h + s + 20;
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="Mahalla bloklari qamrovi">
        {HEX.map((b, i) => { const c = i % 4, r = Math.floor(i / 4), cx = s + c * w + 4, cy = s + 10 + r * h + (c % 2 ? h / 2 : 0), k = col(b.cov); return (
          <g key={b.name} className="hex" onMouseEnter={() => setHv(b)} onMouseLeave={() => setHv(null)} tabIndex={0} onFocus={() => setHv(b)} onBlur={() => setHv(null)}>
            <polygon points={pts(cx, cy)} fill={k} fillOpacity={b.out > 0 ? .85 : .55} stroke={k} strokeWidth="1.5" style={{ filter: b.cov < 85 ? `drop-shadow(0 0 6px ${k})` : "none" }} />
            <text x={cx} y={cy - 2} textAnchor="middle" fontSize="8.5" fill="#06121a" fontWeight="700" style={{ pointerEvents: "none" }}>{b.cov}%</text>
            {b.out > 0 && <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill="#1a0606" fontWeight="700" style={{ pointerEvents: "none" }}>⚠{b.out}</text>}
          </g>); })}
      </svg>
      <div style={{ position: "absolute", left: 8, bottom: 2, fontSize: 11, color: T.muted }}>{hv ? <span><b style={{ color: T.text }}>{hv.name}</b> · qamrov {hv.cov}% · chetda {hv.out}</span> : "Blok ustiga olib boring"}</div>
    </div>
  );
}

/* ───────── ECharts opsiya yordamchilari ───────── */
const baseGrid = { left: 8, right: 14, top: 18, bottom: 22, containLabel: true };
const ax = { axisLine: { lineStyle: { color: "rgba(255,255,255,.14)" } }, axisLabel: { color: T.muted, fontSize: 10 }, splitLine: { lineStyle: { color: "rgba(255,255,255,.05)" } } };
const tip = { backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } };
const lineOpt = (data, labels, color) => ({ backgroundColor: "transparent", grid: baseGrid, tooltip: { trigger: "axis", ...tip }, xAxis: { type: "category", data: labels, ...ax }, yAxis: { type: "value", min: 80, max: 100, ...ax, axisLabel: { ...ax.axisLabel, formatter: "{value}%" } }, series: [{ type: "line", smooth: true, data, symbol: "circle", symbolSize: 4, lineStyle: { color, width: 2.2, shadowColor: color, shadowBlur: 10 }, itemStyle: { color }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: color + "55" }, { offset: 1, color: color + "00" }]) } }] });
const donutOpt = (b, g) => ({ backgroundColor: "transparent", tooltip: { trigger: "item", ...tip }, legend: { bottom: 0, textStyle: { color: T.muted, fontSize: 11 }, icon: "circle" }, series: [{ type: "pie", radius: ["55%", "76%"], center: ["50%", "44%"], label: { show: false }, data: [{ value: b, name: "O'g'il bola", itemStyle: { color: T.teal } }, { value: g, name: "Qiz bola", itemStyle: { color: T.gold } }] }] });
const barOpt = (labels, data, color) => ({ backgroundColor: "transparent", grid: baseGrid, tooltip: { trigger: "axis", ...tip }, xAxis: { type: "category", data: labels, ...ax }, yAxis: { type: "value", ...ax }, series: [{ type: "bar", data, itemStyle: { color, borderRadius: [4, 4, 0, 0] }, barWidth: "58%" }] });

/* ───────── Muassasa modali (drill-down) ───────── */
function InstitutionModal({ inst, onClose }) {
  const labels = inst.kind === "kg" ? inst.groups.map((g) => g[0]) : Array.from({ length: 11 }, (_, i) => `${i + 1}`);
  const distData = inst.kind === "kg" ? inst.groups.map((g) => g[1]) : inst.dist;
  const kpis = [["Jami", fmt(inst.students)], ["O'g'il bola", fmt(inst.boys)], ["Qiz bola", fmt(inst.girls)], ["O'rtacha davomat", `${inst.attendance}%`], ["Surunkali kelmaydigan", fmt(inst.chronic)]];
  return createPortal(
    <div className="tcc-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="tcc-mbox" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div><div style={{ fontFamily: '"Space Grotesk",Inter', fontWeight: 700, fontSize: 18, color: inst.accent }}>{inst.title}</div><div style={{ fontSize: 12, color: T.muted }}>{inst.sub} · {inst.schools.join(" · ")}</div></div>
          <button className="tcc-x" onClick={onClose}>×</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 14 }}>
          {kpis.map(([l, v]) => <div key={l} style={{ border: `1px solid ${T.border}`, borderRadius: 11, padding: "10px 12px", background: "rgba(255,255,255,.02)" }}><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: inst.accent }}>{v}</div><div style={{ fontSize: 10.5, color: T.muted }}>{l}</div></div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14 }}>
          <div><div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Jins bo'yicha</div><MiniChart height={220} option={donutOpt(inst.boys, inst.girls)} /></div>
          <div><div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Oylik o'rtacha davomat — oxirgi 30 kun</div><MiniChart height={220} option={lineOpt(inst.trend, inst.trend.map((_, i) => dayLabel(29 - i)), inst.accent)} /></div>
        </div>
        <div style={{ marginTop: 14 }}><div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{inst.kind === "kg" ? "Yosh guruhlari bo'yicha" : "Sinflar bo'yicha taqsimot"}</div><MiniChart height={200} option={barOpt(labels, distData, inst.accent)} /></div>
        <div style={{ marginTop: 12 }}><span className="tcc-pill">namunaviy</span></div>
      </div>
    </div>, document.body);
}

/* ───────── Muassasa kartasi (sparkline) ───────── */
function InstitutionCard({ inst, delay, onOpen }) {
  const spark = useMemo(() => ({ backgroundColor: "transparent", grid: { left: 0, right: 0, top: 4, bottom: 0 }, xAxis: { type: "category", show: false, data: inst.trend.map((_, i) => i) }, yAxis: { type: "value", show: false, min: 80, max: 100 }, series: [{ type: "line", smooth: true, data: inst.trend, symbol: "none", lineStyle: { color: inst.accent, width: 2 }, areaStyle: { color: inst.accent + "33" } }] }), [inst]);
  return (
    <div className="tcc-card tcc-instc" style={{ animationDelay: `${delay}ms` }} role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}>
      <div className="hd"><div><div className="t" style={{ color: inst.accent, fontSize: 15 }}>{inst.title}</div><div className="s">{inst.sub}</div></div><span style={{ width: 36, height: 36, borderRadius: 10, background: inst.accent + "22", color: inst.accent, display: "grid", placeItems: "center", fontWeight: 800, fontFamily: '"Space Grotesk"' }}>{inst.count}</span></div>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
        <div><div className="mono" style={{ fontSize: 30, fontWeight: 700 }}>{fmt(inst.students)}</div><div style={{ fontSize: 10.5, color: T.muted }}>{inst.kind === "kg" ? "tarbiyalanuvchi" : "o'quvchi"}</div></div>
        <div><div className="mono" style={{ fontSize: 22, fontWeight: 700, color: inst.accent }}>{inst.attendance}%</div><div style={{ fontSize: 10.5, color: T.muted }}>davomat</div></div>
        <div style={{ flex: 1, height: 46 }}><MiniChart height={46} option={spark} /></div>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: T.muted }}>{inst.count} muassasa · ⚠ {inst.chronic} surunkali · <span style={{ color: inst.accent }}>ochish →</span></div>
    </div>
  );
}

/* ───────── O'quvchilar bo'limi ───────── */
const STATUS_BADGE = (st) => st === "doimiy" ? { background: "rgba(47,191,135,.16)", color: T.green } : { background: "rgba(229,72,77,.16)", color: T.red };
function StudentsBlock() {
  const [f, setF] = useState({ grade: "all", status: "all", gender: "all", inst: "all", q: "", aMin: 6, aMax: 18 });
  const [sel, setSel] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const list = useMemo(() => STUDENTS.filter((s) =>
    (f.grade === "all" || s.grade === +f.grade) && (f.status === "all" || s.status === f.status) &&
    (f.gender === "all" || s.gender === f.gender) && (f.inst === "all" || s.inst === f.inst) &&
    s.age >= f.aMin && s.age <= f.aMax && (!f.q || s.name.toLowerCase().includes(f.q.toLowerCase()))), [f]);
  const found = useTween(list.length);
  return (
    <div className="tcc-card tcc-c12" style={{ animationDelay: "120ms" }}>
      <div className="hd"><div><div className="t">O'quvchilar ro'yxati</div><div className="s">Mahalladagi barcha o'quvchilar · filtrlanadi</div></div><span className="tcc-found">topildi: {fmt(found)}</span></div>
      <div className="tcc-filter">
        <input className="tcc-inp" placeholder="Ism bo'yicha qidirish…" value={f.q} onChange={(e) => set("q", e.target.value)} style={{ minWidth: 180 }} />
        <select className="tcc-inp" value={f.grade} onChange={(e) => set("grade", e.target.value)}><option value="all">Barcha sinf</option>{Array.from({ length: 11 }, (_, i) => <option key={i} value={i + 1}>{i + 1}-sinf</option>)}</select>
        <select className="tcc-inp" value={f.status} onChange={(e) => set("status", e.target.value)}><option value="all">Holat: barchasi</option><option value="doimiy">Doimiy keluvchi</option><option value="qoldiruvchi">Dars qoldiruvchi</option></select>
        <select className="tcc-inp" value={f.gender} onChange={(e) => set("gender", e.target.value)}><option value="all">Jins: barchasi</option><option value="o'g'il">O'g'il</option><option value="qiz">Qiz</option></select>
        <select className="tcc-inp" value={f.inst} onChange={(e) => set("inst", e.target.value)}><option value="all">Muassasa: barchasi</option>{SCHOOLS3.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: T.muted }}>Yosh {f.aMin}–{f.aMax}
          <input type="range" min={6} max={18} value={f.aMin} onChange={(e) => set("aMin", Math.min(+e.target.value, f.aMax))} />
          <input type="range" min={6} max={18} value={f.aMax} onChange={(e) => set("aMax", Math.max(+e.target.value, f.aMin))} />
        </label>
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        <table className="tcc-tbl"><thead><tr><th>Ism</th><th>Sinf</th><th>Yosh</th><th>Jins</th><th>Davomat</th><th>Holat</th></tr></thead>
          <tbody>{list.map((s) => (
            <tr key={s.id} className="tcc-srow" onClick={() => setSel(s)}>
              <td style={{ fontWeight: 600 }}>{s.name}</td><td className="mono">{s.grade}</td><td className="mono">{s.age}</td><td style={{ color: T.muted }}>{s.gender}</td>
              <td className="mono" style={{ color: s.att >= 92 ? T.green : s.att >= 88 ? T.amber : T.red, fontWeight: 700 }}>{s.att}%</td>
              <td><span className="tcc-badge" style={STATUS_BADGE(s.status)}>{s.status}</span></td>
            </tr>))}
            {list.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: T.muted, padding: 24 }}>O'quvchi topilmadi</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 8 }}><span className="tcc-pill">namunaviy ro'yxat</span></div>
      {sel && createPortal(
        <div className="tcc-modal" onClick={() => setSel(null)}><div className="tcc-mbox" style={{ width: "min(420px,94vw)", maxHeight: "auto" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 17 }}>{sel.name}</div><button className="tcc-x" onClick={() => setSel(null)}>×</button></div>
          {[["Sinf", `${sel.grade}-sinf`], ["Yosh", sel.age], ["Jins", sel.gender], ["Muassasa", sel.inst], ["Oylik davomat", `${sel.att}%`], ["Holat", sel.status]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}><span style={{ color: T.muted }}>{l}</span><span className="mono" style={{ fontWeight: 600 }}>{v}</span></div>)}
        </div></div>, document.body)}
    </div>
  );
}

/* ───────── Hodimlar bo'limi ───────── */
function StaffBlock() {
  const [f, setF] = useState({ role: "all", inst: "all", subject: "all", q: "" });
  const [sel, setSel] = useState(null); const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const list = useMemo(() => STAFF.filter((s) => (f.role === "all" || s.role === f.role) && (f.inst === "all" || s.inst === f.inst) && (f.subject === "all" || s.subject === f.subject) && (!f.q || s.name.toLowerCase().includes(f.q.toLowerCase()))), [f]);
  const groups = [["Rahbariyat", list.filter((s) => s.role === "Direktor" || s.role === "O'rinbosar")], ["O'qituvchilar", list.filter((s) => s.role === "O'qituvchi").sort((a, b) => a.subject.localeCompare(b.subject))], ["Boshqa xodimlar", list.filter((s) => s.role === "Boshqa")]];
  const teachers = STAFF.filter((s) => s.role === "O'qituvchi");
  const avgExp = (STAFF.reduce((a, s) => a + s.exp, 0) / STAFF.length).toFixed(1);
  const kpi = [["Jami xodim", STAFF.length], ["O'qituvchilar", teachers.length], ["O'rtacha staj", `${avgExp} yil`], ["Fanlar", SUBJECTS.length]];
  return (
    <div className="tcc-card tcc-c12" style={{ animationDelay: "160ms" }}>
      <div className="hd"><div><div className="t">Hodimlar</div><div className="s">Maktab xodimlari · lavozim bo'yicha</div></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>{kpi.map(([l, v]) => <div key={l} style={{ border: `1px solid ${T.border}`, borderRadius: 11, padding: "9px 12px", background: "rgba(255,255,255,.02)" }}><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: T.teal }}>{v}</div><div style={{ fontSize: 10.5, color: T.muted }}>{l}</div></div>)}</div>
      <div className="tcc-filter">
        <input className="tcc-inp" placeholder="Ism bo'yicha…" value={f.q} onChange={(e) => set("q", e.target.value)} style={{ minWidth: 160 }} />
        <select className="tcc-inp" value={f.role} onChange={(e) => set("role", e.target.value)}><option value="all">Lavozim: barchasi</option><option value="Direktor">Direktor</option><option value="O'rinbosar">O'rinbosar</option><option value="O'qituvchi">O'qituvchi</option><option value="Boshqa">Boshqa xodim</option></select>
        <select className="tcc-inp" value={f.subject} onChange={(e) => set("subject", e.target.value)}><option value="all">Fan: barchasi</option>{SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <select className="tcc-inp" value={f.inst} onChange={(e) => set("inst", e.target.value)}><option value="all">Muassasa: barchasi</option>{SCHOOLS3.map((s) => <option key={s} value={s}>{s}</option>)}</select>
      </div>
      {groups.map(([g, arr]) => arr.length > 0 && (
        <div key={g} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", margin: "6px 0" }}>{g} · {arr.length}</div>
          <div className="tcc-staffgrid">{arr.map((s) => (
            <div key={s.id} className="tcc-staffc" role="button" tabIndex={0} onClick={() => setSel(s)} onKeyDown={(e) => e.key === "Enter" && setSel(s)}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
              <div style={{ fontSize: 11.5, color: T.teal }}>{s.role === "O'qituvchi" ? s.subject : s.subject !== "—" ? s.subject : s.role}</div>
              <div style={{ fontSize: 10.5, color: T.muted, marginTop: 3 }}>{s.role} · {s.exp} yil · {s.inst}</div>
            </div>))}</div>
        </div>))}
      {list.length === 0 && <div style={{ textAlign: "center", color: T.muted, padding: 20 }}>Xodim topilmadi</div>}
      <div><span className="tcc-pill">namunaviy</span></div>
      {sel && createPortal(
        <div className="tcc-modal" onClick={() => setSel(null)}><div className="tcc-mbox" style={{ width: "min(420px,94vw)" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 17 }}>{sel.name}</div><button className="tcc-x" onClick={() => setSel(null)}>×</button></div>
          {[["Lavozim", sel.role], ["Fan / yo'nalish", sel.subject], ["Ish staji", `${sel.exp} yil`], ["Muassasa", sel.inst]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}><span style={{ color: T.muted }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span></div>)}
        </div></div>, document.body)}
    </div>
  );
}

/* ───────── Asosiy sahifa ───────── */
const TalimDashboardPage = () => {
  const [days, setDays] = useState(14);
  const [openInst, setOpenInst] = useState(null);
  useEffect(() => { if (!document.getElementById("tcc-style")) { const st = document.createElement("style"); st.id = "tcc-style"; st.textContent = CSS; document.head.appendChild(st); } }, []);
  useEffect(() => { if (!document.getElementById("tcc-fonts")) { const l = document.createElement("link"); l.id = "tcc-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"; document.head.appendChild(l); } }, []);

  const out = useCountUp(M.outOfSchool); const cov = useCountUp(+(((M.children6_18 - M.outOfSchool) / M.children6_18) * 100).toFixed(1), 1500); const kids = useCountUp(M.children6_18, 1500); const chr = useCountUp(M.chronic);

  const sankey = useMemo(() => { const red = { itemStyle: { color: T.alarm }, label: { color: T.alarm } }; return { backgroundColor: "transparent", tooltip: { trigger: "item", ...tip }, series: [{ type: "sankey", left: 6, right: 130, top: 12, bottom: 12, nodeWidth: 13, nodeGap: 13, emphasis: { focus: "adjacency" }, draggable: false, label: { color: T.text, fontSize: 11 }, lineStyle: { color: "gradient", curveness: .5, opacity: .42 }, data: [{ name: "Bolalar 6–18", itemStyle: { color: T.gold } }, { name: "Maktabda o'qiyapti", itemStyle: { color: T.green } }, { name: "Maktabgacha tayyorlov", itemStyle: { color: T.teal } }, { name: "⚠ Chetda qolgan", ...red }, { name: "9-sinfni tugatdi", itemStyle: { color: T.gold } }, { name: "10-sinf (akademik)", itemStyle: { color: T.green } }, { name: "Kollej / texnikum", itemStyle: { color: T.teal } }, { name: "⚠ Hech qayerda", ...red }], links: [{ source: "Bolalar 6–18", target: "Maktabda o'qiyapti", value: 2540 }, { source: "Bolalar 6–18", target: "Maktabgacha tayyorlov", value: 109 }, { source: "Bolalar 6–18", target: "⚠ Chetda qolgan", value: 31, lineStyle: { color: T.alarm, opacity: .65 } }, { source: "Maktabda o'qiyapti", target: "9-sinfni tugatdi", value: 224 }, { source: "9-sinfni tugatdi", target: "10-sinf (akademik)", value: 150 }, { source: "9-sinfni tugatdi", target: "Kollej / texnikum", value: 65 }, { source: "9-sinfni tugatdi", target: "⚠ Hech qayerda", value: 9, lineStyle: { color: T.alarm, opacity: .65 } }] }] }; }, []);
  const radar = useMemo(() => { const rings = [["9-dan keyin", 96, T.gold], ["O'rta", 97, T.teal], ["Boshlang'ich", 99, T.green], ["Maktabgacha", 78, T.amber]]; return { backgroundColor: "transparent", series: rings.map((r, i) => ({ type: "gauge", startAngle: 90, endAngle: -270, radius: `${92 - i * 18}%`, center: ["50%", "52%"], pointer: { show: false }, progress: { show: true, roundCap: true, width: 8, itemStyle: { color: r[2] } }, axisLine: { lineStyle: { width: 8, color: [[1, "rgba(255,255,255,.06)"]] } }, splitLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, data: [{ value: r[1] }], detail: { show: false } })) }; }, []);
  const trend = useMemo(() => lineOpt(trend30(1).slice(30 - days), Array.from({ length: days }, (_, i) => dayLabel(days - 1 - i)), T.teal), [days]);
  const classes = useMemo(() => barOpt(Array.from({ length: 11 }, (_, i) => i + 1), classDist(2860, 1), T.teal), []);
  const girls = useMemo(() => ({ backgroundColor: "transparent", tooltip: { trigger: "item", ...tip }, series: [{ type: "pie", radius: ["56%", "78%"], center: ["50%", "48%"], label: { show: false }, data: [{ value: 1231, name: "Qamrovda", itemStyle: { color: T.green } }, { value: 14, name: "Chetda qolgan qiz", itemStyle: { color: T.alarm } }] }] }), []);

  return (
    <div className="tcc">
      <div className="tcc-top">
        <div className="tcc-emb">UT</div>
        <div style={{ marginRight: "auto" }}><div className="nm">Mahalla Ta'lim Komandavoy Markazi</div><div className="sb">{M.name} · {M.area}</div></div>
        <span className="tcc-live"><i /> JONLI</span>
        <select className="tcc-sel" value={days} onChange={(e) => setDays(+e.target.value)} aria-label="Sana filtri"><option value={7}>7 kun</option><option value={14}>14 kun</option><option value={30}>30 kun</option></select>
        <div className="sb mono">24.06.2026</div>
      </div>

      <div className="tcc-wrap">
        {/* HERO */}
        <div className="tcc-hero">
          <div className="tcc-alarm"><div style={{ fontSize: 11, color: "#ffb3b3", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px" }}>⚠ Ta'limdan chetda qolgan bolalar</div><div className="big">{fmt(out)}</div><div style={{ fontSize: 11.5, color: T.muted, marginTop: 6 }}>6–18 yosh · ish 12 · kasallik 7 · noaniq 9 · ko'chgan 3</div></div>
          {[["Umumiy qamrov", `${cov.toFixed(1)}%`, T.green], ["Jami bola (6–18)", fmt(kids), T.text], ["Surunkali kelmaydigan", fmt(chr), T.amber]].map(([l, v, c], i) => <div className="tcc-kpi" key={i}><div className="lab">{l}</div><div className="val" style={{ color: c }}>{v}</div></div>)}
        </div>

        {/* Sankey + hex */}
        <div className="tcc-grid" style={{ marginBottom: 14 }}>
          <EPanel className="tcc-c8" delay={120} height={360} title="Bola qayoqqa ketadi — oqim" subtitle="6–18 yosh · maktab → 9-sinfdan keyin" option={sankey} note={<span><span className="tcc-pill">namunaviy</span> &nbsp;Qizil tarmoqlar — chetda qolgan / hech qayerda</span>} />
          <div className="tcc-card tcc-c4" style={{ animationDelay: "220ms" }}><div className="hd"><div><div className="t">Tirik mahalla — qamrov</div><div className="s">Bloklar (hex)</div></div></div><HexGrid /><div className="tcc-note"><span className="tcc-pill">namunaviy · qizil = past qamrov</span></div></div>
        </div>

        {/* Qo'llab-quvvatlovchi */}
        <div className="tcc-grid">
          <EPanel className="tcc-c4" delay={260} height={230} title="Qamrov radari" subtitle="Maktabgacha → 9-dan keyin" option={radar} note="Maktabgacha 78% · Boshlang'ich 99% · O'rta 97% · 9-dan keyin 96%" />
          <EPanel className="tcc-c8" delay={300} height={230} title="Davomat tendentsiyasi" subtitle={`Oxirgi ${days} kun`} option={trend} note={<span className="tcc-pill">namunaviy</span>} />
          <EPanel className="tcc-c5" delay={340} height={210} title="Sinflar bo'yicha taqsimot" subtitle="1–11-sinf o'quvchilari" option={classes} note={<span className="tcc-pill">namunaviy</span>} />
          <EPanel className="tcc-c4" delay={380} height={210} title="Qizlar bo'yicha kesim" subtitle="Erta nikoh xavfi monitoringi" option={girls} note={<span><span className="tcc-pill">namunaviy</span> &nbsp;Qizlar 1245 · qamrov 98.9% · chetda 14</span>} />
          <div className="tcc-card tcc-c3" style={{ animationDelay: "420ms" }}><div className="hd"><div><div className="t">Xavf guruhlari</div><div className="s">Maxsus e'tibor</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 2 }}>{[["Kam ta'minlangan oila", 86, T.amber], ["Yetim / vasiylik", 9, T.teal], ["Nogironligi bor", 14, T.gold]].map(([l, n, c]) => <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 10, background: "rgba(255,255,255,.02)" }}><div className="mono" style={{ fontSize: 22, fontWeight: 700, color: c, minWidth: 40 }}>{n}</div><div style={{ fontSize: 11.5 }}>{l}</div></div>)}</div>
            <div className="tcc-note"><span className="tcc-pill">namunaviy</span></div>
          </div>
        </div>

        {/* ═══ UMUMIY MA'LUMOTLAR ═══ */}
        <div className="tcc-h2">Umumiy ma'lumotlar</div>
        <div className="tcc-inst" style={{ marginBottom: 14 }}>
          {INST.map((it, i) => <InstitutionCard key={it.id} inst={it} delay={i * 80} onOpen={() => setOpenInst(it)} />)}
        </div>
        <div className="tcc-grid" style={{ marginBottom: 14 }}><StudentsBlock /></div>
        <div className="tcc-grid"><StaffBlock /></div>

        <div style={{ marginTop: 16, fontSize: 11.5, color: T.muted }}>Barcha ko'rsatkichlar — <b>namunaviy (sintetik)</b>. Faqat bitta mahalla ichki tizimi.</div>
      </div>

      {openInst && <InstitutionModal inst={openInst} onClose={() => setOpenInst(null)} />}
    </div>
  );
};

export default TalimDashboardPage;
