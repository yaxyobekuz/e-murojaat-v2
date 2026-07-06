// Mahalla IIB — "XAVFSIZLIK KOMANDAVOY MARKAZI". Quyuq, premium, yagona sahifa.
// FAQAT DEMO (backend yo'q) · faqat Sarnovul MFY. Imzo: jonli kamera devori + avtomobil
// oqimi + begona-avto ALARM (O'zbek davlat raqami dizayni). ECharts + CSS simulyatsiya.
//
// REAL TIZIMGA ULASH (kelajakda): kamera RTSP→backend→HLS/WebRTC; raqam o'qish ANPR
// (OpenALPR) backendda; aniqlangan raqam mahalla bazasiga (PostgreSQL) solishtiriladi,
// topilmasa "begona" eventi WebSocket orqali keladi. HUQUQIY: shaxsiy ma'lumot va
// videokuzatuv qonunchiligiga rioya, ruxsat va saqlash muddati shart.
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

/* ───────── O'zbek davlat raqami ───────── */
const REGIONS = ["01", "10", "20", "25", "30", "40", "50", "60", "70", "75", "80", "85", "90", "95"];
const MAHALLA_REG = ["40"]; // Andijon
const LETTERS = "ABCDEFGHIJKLMNOPRSTUVXYZ".split("");
const L = () => pick(LETTERS);
const genNumber = (region) => Math.random() < 0.5
  ? `${region} ${L()} ${ri(100, 999)} ${L()}${L()}`           // 01 A 123 BC
  : `${region} ${ri(1000, 9999)} ${L()}${L()}${L()}`;          // 30 7890 ABC
// Ro'yxatdagi mahalla bazasi (~40 ta, Andijon)
const REGISTERED = Array.from({ length: 40 }, () => genNumber(pick(MAHALLA_REG)));
// Real footage — kamera tasviri uchun (Pexels CDN, ko'cha/trafik) + avto rasmi (LoremFlickr)
const CCTV_FILTER = "grayscale(.38) contrast(1.12) saturate(.72) brightness(.92)";
const vid = (id, f) => `https://videos.pexels.com/video-files/${id}/${f}.mp4`;
const fl = (kw, lock) => `https://loremflickr.com/420/260/${kw}?lock=${lock}`;
// O'tayotgan mashina: 80% ro'yxatdan (yashil), 20% begona (qizil)
let CARID = 0;
const nextCar = (cam) => {
  CARID++;
  const foreign = Math.random() < 0.2;
  const plate = foreign
    ? (Math.random() < 0.7 ? genNumber(pick(REGIONS.filter((r) => !MAHALLA_REG.includes(r)))) : genNumber("01"))
    : pick(REGISTERED);
  const d = new Date();
  const dir = cam.startsWith("Kirish") ? "Kirim" : cam.startsWith("Chiqish") ? "Chiqim" : (Math.random() < 0.5 ? "Kirim" : "Chiqim");
  return { id: CARID, plate, foreign, cam, dir, time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`, ts: Date.now(), img: fl("car,street,traffic", CARID * 7 + 11) };
};

/* ───────── CSS ───────── */
const CSS = `
.scc{font-family:Inter,system-ui,sans-serif;color:${T.text};background:${T.bg};min-height:100%;position:relative;overflow:hidden}
.scc::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(900px 500px at 18% -8%,rgba(224,169,59,.10),transparent 60%),radial-gradient(800px 600px at 95% 8%,rgba(45,212,191,.08),transparent 60%),radial-gradient(700px 500px at 50% 120%,rgba(255,77,77,.06),transparent 60%)}
.scc::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:38px 38px;animation:sccGrid 40s linear infinite}
@keyframes sccGrid{to{background-position:38px 38px}}
.scc h1,.scc h2,.scc h3,.scc .ttl{font-family:"Space Grotesk",Inter,sans-serif}
.scc .mono{font-family:"JetBrains Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}
.scc *{box-sizing:border-box}
.scc-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;padding:12px 20px;flex-wrap:wrap;background:rgba(10,17,25,.72);backdrop-filter:blur(12px);border-bottom:1px solid ${T.border};transform:translateY(-100%);animation:sccDrop .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes sccDrop{to{transform:translateY(0)}}
.scc-emb{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,${T.gold},#7a5414);display:grid;place-items:center;font-weight:800;color:#1a1205;font-family:"Space Grotesk";box-shadow:0 0 18px rgba(224,169,59,.4)}
.scc-top .nm{font-weight:700;font-size:15px;font-family:"Space Grotesk"}.scc-top .sb{font-size:11px;color:${T.muted}}
.scc-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:${T.teal}}
.scc-live i{width:7px;height:7px;border-radius:50%;background:${T.teal};box-shadow:0 0 8px ${T.teal};animation:sccPulse 1.4s ease-in-out infinite}
@keyframes sccPulse{50%{opacity:.3;transform:scale(.7)}}
.scc-demo{font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:rgba(224,169,59,.16);color:${T.gold}}
.scc-wrap{position:relative;z-index:1;padding:18px 20px;max-width:1600px;margin:0 auto}
.scc-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
.scc-card{background:linear-gradient(180deg,rgba(15,26,36,.82),rgba(12,21,30,.82));border:1px solid ${T.border};border-radius:16px;padding:14px 16px;box-shadow:0 1px 0 rgba(255,255,255,.03) inset,0 18px 40px -24px rgba(0,0,0,.9);backdrop-filter:blur(8px);display:flex;flex-direction:column;min-width:0;opacity:0;transform:translateY(16px);animation:sccUp .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes sccUp{to{opacity:1;transform:translateY(0)}}
.scc-card .hd{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:10px}
.scc-card .hd .t{font-weight:700;font-size:13.5px;font-family:"Space Grotesk"}.scc-card .hd .s{font-size:11px;color:${T.muted}}
.scc-exp{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:28px;height:28px;display:grid;place-items:center;cursor:pointer;color:${T.muted}}
.scc-exp:hover{color:${T.text};border-color:${T.gold}}
.scc-ch{width:100%;overflow:hidden;position:relative}
.scc-note{font-size:11px;color:${T.muted};margin-top:8px}
.scc-pill{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(224,169,59,.14);color:${T.gold}}
/* HERO */
.scc-hero{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:14px;margin-bottom:14px}
.scc-kpi{background:rgba(15,26,36,.8);border:1px solid ${T.border};border-radius:16px;padding:14px 16px}
.scc-kpi .lab{font-size:11px;color:${T.muted};font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.scc-kpi .val{font-family:"JetBrains Mono";font-size:30px;font-weight:700;margin-top:6px}
.scc-safe{background:radial-gradient(120% 120% at 30% 0%,rgba(47,191,135,.16),rgba(15,26,36,.85));border:1px solid rgba(47,191,135,.35);border-radius:18px;padding:16px 18px}
.scc-safe .big{font-family:"JetBrains Mono";font-size:60px;font-weight:700;line-height:1;color:${T.green};text-shadow:0 0 22px rgba(47,191,135,.5)}
/* Kamera devori */
.scc-cams{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.scc-cam{position:relative;aspect-ratio:16/10;border-radius:12px;overflow:hidden;border:1px solid ${T.border};background:#05080d}
.scc-cam .feed{position:absolute;inset:0;background:linear-gradient(160deg,#0a141f,#04070c 60%,#0a141f);}
.scc-cam .feed::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 3px);animation:sccScan 6s linear infinite}
.scc-cam .feed::after{content:"";position:absolute;inset:-50%;background:radial-gradient(circle,rgba(45,212,191,.06),transparent 60%);animation:sccNoise 3s steps(6) infinite}
@keyframes sccScan{to{background-position:0 60px}}
@keyframes sccNoise{0%{transform:translate(0,0)}100%{transform:translate(4%,3%)}}
.scc-cam .rec{position:absolute;left:8px;top:8px;display:flex;align-items:center;gap:5px;font-size:9px;font-weight:700;color:#ff9b9b}
.scc-cam .rec i{width:7px;height:7px;border-radius:50%;background:${T.alarm};box-shadow:0 0 8px ${T.alarm};animation:sccPulse 1.1s infinite}
.scc-cam .cnm{position:absolute;left:8px;bottom:8px;font-size:9.5px;color:#cfe;text-shadow:0 1px 2px #000}
.scc-cam .clk{position:absolute;right:8px;top:8px;font-family:"JetBrains Mono";font-size:10px;color:${T.green};background:rgba(0,0,0,.5);padding:1px 5px;border-radius:4px}
.scc-cam .ghost{position:absolute;bottom:14%;left:-30%;opacity:.5;animation:sccDrive linear infinite}
@keyframes sccDrive{to{left:120%}}
.scc-scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 1px,transparent 1px 3px);animation:sccScan 6s linear infinite;mix-blend-mode:overlay}
.scc-vig{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 55px rgba(0,0,0,.6)}
.scc-expicon{position:absolute;right:8px;bottom:8px;font-size:13px;color:rgba(255,255,255,.55)}
.scc-cam:hover .scc-expicon{color:#fff}
/* Avtomobil oqimi lentasi */
.scc-flow{display:flex;gap:8px;overflow:hidden;padding:6px 2px;mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.scc-carc{flex:0 0 auto;width:128px;border:1px solid ${T.border};border-radius:10px;padding:7px 9px;background:rgba(255,255,255,.02);animation:sccSlide .5s cubic-bezier(.2,.8,.2,1)}
@keyframes sccSlide{from{opacity:0;transform:translateX(-24px)}}
/* O'zbek davlat raqami */
.scc-plate{display:inline-flex;align-items:stretch;background:#fff;border:2px solid #0c0c0c;border-radius:5px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.45)}
.scc-plate .num{color:#0c0c0c;font-family:"JetBrains Mono",monospace;font-weight:800;letter-spacing:1.5px;display:flex;align-items:center;padding:3px 9px}
.scc-plate .uz{background:#1957c8;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 6px;font-size:8px;font-weight:800;letter-spacing:.5px;gap:2px;border-left:1px solid #0c0c0c}
.scc-plate .flag{width:14px;height:9px;border-radius:1px;overflow:hidden;display:flex;flex-direction:column}
.scc-plate .flag b{flex:1}
.scc-plate.lg .num{font-size:30px;padding:8px 16px;letter-spacing:3px}.scc-plate.lg .uz{font-size:11px;padding:0 10px}.scc-plate.lg .flag{width:22px;height:14px}
.scc-plate.sm .num{font-size:12px;padding:2px 6px;letter-spacing:1px}.scc-plate.sm .uz{font-size:6.5px;padding:0 4px}.scc-plate.sm .flag{width:10px;height:6px}
/* ALARM */
.scc-alarm{border:1px solid rgba(255,77,77,.5);border-radius:18px;padding:16px 18px;background:radial-gradient(120% 130% at 20% 0%,rgba(255,77,77,.22),rgba(15,26,36,.9));box-shadow:0 0 40px -8px rgba(255,77,77,.5);display:flex;gap:18px;align-items:center;animation:sccBoom .5s cubic-bezier(.2,.9,.2,1)}
@keyframes sccBoom{0%{transform:scale(.85);opacity:0}60%{transform:scale(1.02)}100%{transform:scale(1)}}
.scc-alarm .glow{animation:sccAl 1.6s ease-in-out infinite}
@keyframes sccAl{50%{box-shadow:0 0 60px -6px rgba(255,77,77,.8)}}
.scc-btn{background:rgba(255,255,255,.05);color:${T.text};border:1px solid ${T.border};border-radius:8px;padding:7px 14px;font-size:12.5px;cursor:pointer}
.scc-btn:hover{border-color:${T.gold}}
.scc-tbl{width:100%!important;min-width:0!important;border-collapse:collapse;font-size:12.5px}
.scc-tbl thead{background:transparent!important}
.scc-tbl th{text-align:left!important;color:${T.muted}!important;font-weight:600;font-size:10.5px;text-transform:uppercase;padding:7px 8px!important;border-bottom:1px solid ${T.border}}
.scc-tbl tbody{border:0!important}.scc-tbl tbody tr{background:transparent!important}
.scc-tbl td{padding:8px 8px!important;border-bottom:1px solid rgba(255,255,255,.06)!important;color:${T.text}}
.scc-staffgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.scc-staffc{border:1px solid ${T.border};border-radius:12px;padding:11px 13px;background:rgba(255,255,255,.02)}
.scc-c3{grid-column:span 3}.scc-c4{grid-column:span 4}.scc-c5{grid-column:span 5}.scc-c6{grid-column:span 6}.scc-c7{grid-column:span 7}.scc-c8{grid-column:span 8}.scc-c12{grid-column:span 12}
.scc-modal{position:fixed;inset:0;z-index:99999;background:rgba(5,10,15,.78);display:grid;place-items:center;padding:18px;backdrop-filter:blur(4px)}
.scc-mbox{color:${T.text};font-family:Inter;background:${T.panel};border:1px solid ${T.border};border-radius:18px;width:min(1080px,96vw);height:min(82vh,820px);display:flex;flex-direction:column;padding:18px 20px;box-shadow:0 40px 100px rgba(0,0,0,.7)}
.scc-x{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:34px;height:34px;cursor:pointer;color:${T.text};font-size:18px}
.hex{transition:transform .18s,filter .18s;cursor:pointer;transform-box:fill-box;transform-origin:center}.hex:hover{transform:scale(1.12);filter:brightness(1.25)}
.scc a:focus-visible,.scc button:focus-visible{outline:3px solid ${T.gold};outline-offset:2px;border-radius:8px}
@media(max-width:1100px){.scc-hero{grid-template-columns:repeat(2,1fr)}.scc-cams{grid-template-columns:repeat(2,1fr)}.scc-c4,.scc-c5,.scc-c6,.scc-c7,.scc-c8{grid-column:span 12}.scc-c3{grid-column:span 6}}
@media(prefers-reduced-motion:reduce){.scc *,.scc::after{animation:none!important;transition:none!important}.scc-card,.scc-top{opacity:1!important;transform:none!important}}
`;

/* ───────── Hooks ───────── */
function useCountUp(target, dur = 1300) {
  const [v, setV] = useState(reduced ? target : 0);
  useEffect(() => { if (reduced) { setV(target); return; } let raf; const t0 = performance.now(); const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setV(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [target, dur]);
  return v;
}
function useClock() { const [t, setT] = useState(() => new Date()); useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []); return `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`; }

/* ───────── O'zbek raqam komponenti ───────── */
function UzPlate({ plate, size = "" }) {
  return (
    <span className={`scc-plate ${size}`}>
      <span className="num">{plate}</span>
      <span className="uz"><span className="flag"><b style={{ background: "#1eb4e6" }} /><b style={{ background: "#fff" }} /><b style={{ background: "#1fa84e" }} /></span>UZ</span>
    </span>
  );
}
const CarSil = ({ color = "#9fb6c0", w = 120 }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 120 50" aria-hidden="true"><path d="M6 38 L14 24 Q18 18 30 17 L70 16 Q86 16 96 26 L110 30 Q116 32 116 38 L116 42 L6 42 Z" fill={color} opacity=".85" /><circle cx="32" cy="42" r="7" fill="#0c0c0c" /><circle cx="92" cy="42" r="7" fill="#0c0c0c" /><circle cx="32" cy="42" r="3" fill="#444" /><circle cx="92" cy="42" r="3" fill="#444" /><path d="M34 24 L66 23 L82 27 L34 28 Z" fill="#10202b" /></svg>
);

/* ───────── EChart panel ───────── */
function EPanel({ title, subtitle, note, option, className = "scc-c6", delay = 0, height = 220 }) {
  const ref = useRef(null), inst = useRef(null), mref = useRef(null), minst = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!ref.current) return; inst.current = echarts.init(ref.current); inst.current.setOption(option); const ro = new ResizeObserver(() => inst.current && inst.current.resize()); ro.observe(ref.current); return () => { ro.disconnect(); inst.current && inst.current.dispose(); }; }, []);
  useEffect(() => { inst.current && inst.current.setOption(option, true); }, [option]);
  useEffect(() => { if (!open || !mref.current) return; minst.current = echarts.init(mref.current); minst.current.setOption(option); const ro = new ResizeObserver(() => minst.current && minst.current.resize()); ro.observe(mref.current); const k = (e) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", k); return () => { ro.disconnect(); window.removeEventListener("keydown", k); minst.current && minst.current.dispose(); }; }, [open]);
  return (
    <div className={`scc-card ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="hd"><div><div className="t">{title}</div>{subtitle && <div className="s">{subtitle}</div>}</div><button className="scc-exp" onClick={() => setOpen(true)} aria-label={`${title} kengaytirish`}>⤢</button></div>
      <div className="scc-ch" ref={ref} style={{ height }} />
      {note && <div className="scc-note">{note}</div>}
      {open && createPortal(<div className="scc-modal" onClick={() => setOpen(false)}><div className="scc-mbox" onClick={(e) => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 16 }}>{title}</div><button className="scc-x" onClick={() => setOpen(false)}>×</button></div><div ref={mref} style={{ flex: 1 }} /></div></div>, document.body)}
    </div>
  );
}

/* ───────── Hex xarita ───────── */
const HEXB = [["Markaziy", 1], ["Bog'", 0], ["Maktab-66", 0], ["Bozor", 3], ["Sanoat", 4], ["Yangi daha", 1], ["Maktab-67", 0], ["Chekka", 3], ["Park", 0], ["Stadion", 1], ["Avtostansiya", 4], ["Eski mahalla", 2]].map(([name, risk]) => ({ name, risk }));
function HexMap() {
  const [hv, setHv] = useState(null); const s = 34, w = s * 1.5, h = Math.sqrt(3) * s;
  const col = (r) => [T.green, "#86c98f", T.gold, "#e08a2c", T.alarm][r];
  const pts = (cx, cy) => Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 180) * (60 * i); return `${(cx + s * Math.cos(a)).toFixed(1)},${(cy + s * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const W = 4 * w + s, H = 3 * h + s + 20;
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="Huquqbuzarlik xavf xaritasi">
        {HEXB.map((b, i) => { const c = i % 4, r = Math.floor(i / 4), cx = s + c * w + 4, cy = s + 10 + r * h + (c % 2 ? h / 2 : 0), k = col(b.risk); return (
          <g key={b.name} className="hex" onMouseEnter={() => setHv(b)} onMouseLeave={() => setHv(null)} tabIndex={0} onFocus={() => setHv(b)} onBlur={() => setHv(null)}>
            <polygon points={pts(cx, cy)} fill={k} fillOpacity={b.risk >= 3 ? .85 : .5} stroke={k} strokeWidth="1.5" style={{ filter: b.risk >= 3 ? `drop-shadow(0 0 6px ${k})` : "none" }} />
            <text x={cx} y={cy + 2} textAnchor="middle" fontSize="7.5" fill="#06121a" fontWeight="700" style={{ pointerEvents: "none" }}>{["xavfsiz", "past", "o'rta", "yuqori", "alarm"][b.risk]}</text>
          </g>); })}
      </svg>
      <div style={{ position: "absolute", left: 8, bottom: 2, fontSize: 11, color: T.muted }}>{hv ? <span><b style={{ color: T.text }}>{hv.name}</b> · xavf: {["xavfsiz", "past", "o'rta", "yuqori", "alarm"][hv.risk]}</span> : "Blok ustiga olib boring"}</div>
    </div>
  );
}

/* ───────── Kamera devori ───────── */
const CAMS = ["Kirish — Sarnovul ko'chasi", "Chiqish — Bog' ko'chasi", "Markaziy chorraha", "Maktab oldi", "Bozor kirishi", "MFY posti"];
const CAM_VIDEOS = [
  vid(2034115, "2034115-sd_640_360_30fps"), vid(5921059, "5921059-sd_640_360_30fps"), vid(1721294, "1721294-sd_640_360_25fps"),
  vid(857195, "857195-sd_640_360_25fps"), vid(2099536, "2099536-sd_640_360_30fps"), vid(854671, "854671-sd_640_360_25fps"),
];
function CamFeed({ src, big }) {
  return (
    <>
      <video src={src} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: CCTV_FILTER }} />
      <div className="scc-scan" />
      <div className="scc-vig" />
    </>
  );
}
function CameraWall({ onOpen }) {
  const clk = useClock();
  return (
    <div className="scc-cams">
      {CAMS.map((nm, i) => (
        <button className="scc-cam" key={nm} onClick={() => onOpen(i)} title="Kamerani ochish" style={{ cursor: "pointer", padding: 0, textAlign: "left" }}>
          <CamFeed src={CAM_VIDEOS[i]} />
          <div className="rec"><i /> REC</div>
          <div className="clk mono">{clk}</div>
          <div className="cnm">CAM-{pad(i + 1)} · {nm}</div>
          <div className="scc-expicon">⤢</div>
        </button>
      ))}
    </div>
  );
}
function CameraModal({ idx, onClose }) {
  const clk = useClock();
  return createPortal(
    <div className="scc-modal" onClick={onClose}><div className="scc-mbox" onClick={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><div><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 16 }}>CAM-{pad(idx + 1)} · {CAMS[idx]}</div><div style={{ fontSize: 11, color: T.muted }}>Sarnovul MFY · jonli kuzatuv</div></div><button className="scc-x" onClick={onClose}>×</button></div>
      <div style={{ flex: 1, position: "relative", borderRadius: 12, overflow: "hidden", background: "#000" }}>
        <CamFeed src={CAM_VIDEOS[idx]} />
        <div className="rec" style={{ fontSize: 12 }}><i /> REC</div>
        <div className="clk mono" style={{ fontSize: 13 }}>{clk}</div>
        <div className="cnm" style={{ fontSize: 12 }}>CAM-{pad(idx + 1)} · {CAMS[idx]}</div>
      </div>
      <div style={{ marginTop: 10 }}><span className="scc-pill">DEMO footage — namunaviy</span></div>
    </div></div>, document.body);
}
function CarModal({ car, onClose }) {
  return createPortal(
    <div className="scc-modal" onClick={onClose}><div className="scc-mbox" style={{ height: "auto", maxHeight: "88vh" }} onClick={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 17, color: car.foreign ? T.alarm : T.green }}>{car.foreign ? "⚠ Begona avtomobil" : "✓ Ro'yxatdagi avtomobil"}</div><button className="scc-x" onClick={onClose}>×</button></div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`, aspectRatio: "16/10", background: "#05080d" }}>
          <img src={car.img} alt="avto" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: CCTV_FILTER }} />
          <div className="scc-scan" /><div className="scc-vig" />
          <div className="rec"><i /> {car.cam}</div>
          <div className="clk mono">{car.time}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Davlat raqami</div>
          <UzPlate plate={car.plate} size="lg" />
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[["Holat", car.foreign ? "BEGONA — ro'yxatda yo'q" : "Ro'yxatda mavjud"], ["Aniqlangan kamera", car.cam], ["Aniqlangan vaqt", car.date || car.time], ["Hudud", "Sarnovul MFY"]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}><span style={{ color: T.muted }}>{l}</span><span style={{ fontWeight: 600, color: l === "Holat" ? (car.foreign ? T.alarm : T.green) : T.text }}>{v}</span></div>)}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}><button className="scc-btn" style={{ borderColor: T.gold, color: T.gold }} onClick={() => alert("DEMO: bazadan tekshirilmoqda")}>Bazadan tekshirish</button></div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}><span className="scc-pill">DEMO — namunaviy</span></div>
    </div></div>, document.body);
}

/* ───────── Asosiy ───────── */
const IibDashboardPage = () => {
  useEffect(() => { if (!document.getElementById("scc-style")) { const st = document.createElement("style"); st.id = "scc-style"; st.textContent = CSS; document.head.appendChild(st); } if (!document.getElementById("scc-fonts")) { const l = document.createElement("link"); l.id = "scc-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700;800&display=swap"; document.head.appendChild(l); } }, []);

  const [cars, setCars] = useState(() => Array.from({ length: 8 }, () => nextCar(pick(CAMS))));
  const [alarms, setAlarms] = useState([]);
  const [passed, setPassed] = useState(312);
  const [foreign, setForeign] = useState(58);
  const [selCam, setSelCam] = useState(null);
  const [selCar, setSelCar] = useState(null);
  const [registry, setRegistry] = useState(() => Array.from({ length: 36 }, () => { const c = nextCar(pick(CAMS)); return { ...c, time: `${pad(ri(6, 20))}:${pad(ri(0, 59))}:${pad(ri(0, 59))}` }; }).sort((a, b) => (a.time < b.time ? 1 : -1)));
  const [regOpen, setRegOpen] = useState(false);
  const [regFilter, setRegFilter] = useState("all");

  useEffect(() => {
    if (reduced) return; let stop = false;
    const tick = () => {
      if (stop) return;
      const car = nextCar(pick(CAMS));
      setCars((p) => [car, ...p].slice(0, 14));
      setRegistry((p) => [car, ...p].slice(0, 300));
      setPassed((n) => n + 1);
      if (car.foreign) { setForeign((n) => n + 1); setAlarms((p) => [{ ...car, date: new Date().toLocaleString("uz-UZ"), checked: false }, ...p].slice(0, 10)); }
      setTimeout(tick, ri(2000, 4000));
    };
    const id = setTimeout(tick, 1500);
    return () => { stop = true; clearTimeout(id); };
  }, []);

  const safeDays = useCountUp(47); const prof = useCountUp(34); const open102 = useCountUp(12);
  const latest = alarms[0];

  /* charts */
  const flow24 = useMemo(() => ({ backgroundColor: "transparent", grid: { left: 8, right: 12, top: 22, bottom: 22, containLabel: true }, tooltip: { trigger: "axis", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } }, legend: { right: 6, top: 0, textStyle: { color: T.muted, fontSize: 10 } }, xAxis: { type: "category", data: Array.from({ length: 24 }, (_, i) => `${i}`), axisLabel: { color: T.muted, fontSize: 9 }, axisLine: { lineStyle: { color: "rgba(255,255,255,.14)" } } }, yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,.05)" } }, axisLabel: { color: T.muted, fontSize: 9 } }, series: [{ name: "Kirish", type: "line", smooth: true, symbol: "none", data: Array.from({ length: 24 }, (_, i) => 6 + Math.round(14 * Math.sin(i / 3) + i)), lineStyle: { color: T.teal, width: 2 }, areaStyle: { color: "rgba(45,212,191,.12)" } }, { name: "Chiqish", type: "line", smooth: true, symbol: "none", data: Array.from({ length: 24 }, (_, i) => 5 + Math.round(12 * Math.cos(i / 3) + i)), lineStyle: { color: T.gold, width: 2 }, areaStyle: { color: "rgba(224,169,59,.10)" } }] }), []);
  const foreign7 = useMemo(() => ({ backgroundColor: "transparent", grid: { left: 8, right: 12, top: 16, bottom: 22, containLabel: true }, tooltip: { trigger: "axis", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } }, xAxis: { type: "category", data: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"], axisLabel: { color: T.muted, fontSize: 10 }, axisLine: { lineStyle: { color: "rgba(255,255,255,.14)" } } }, yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,.05)" } }, axisLabel: { color: T.muted, fontSize: 9 } }, series: [{ type: "bar", data: [42, 51, 38, 60, 47, 73, 58], itemStyle: { color: T.alarm, borderRadius: [4, 4, 0, 0] }, barWidth: "55%" }] }), []);
  const profDonut = useMemo(() => ({ backgroundColor: "transparent", tooltip: { trigger: "item", backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } }, legend: { bottom: 0, textStyle: { color: T.muted, fontSize: 10 }, icon: "circle" }, series: [{ type: "pie", radius: ["48%", "72%"], center: ["50%", "42%"], label: { show: false }, data: [{ value: 6, name: "Giyohvandlik", itemStyle: { color: T.alarm } }, { value: 11, name: "Oila-maishiy", itemStyle: { color: T.gold } }, { value: 9, name: "Reabilitatsiya", itemStyle: { color: T.teal } }, { value: 4, name: "Voyaga yetmagan", itemStyle: { color: "#7c6cf0" } }, { value: 4, name: "Temir daftar", itemStyle: { color: T.green } }] }] }), []);

  return (
    <div className="scc">
      <div className="scc-top">
        <div className="scc-emb">IIB</div>
        <div style={{ marginRight: "auto" }}><div className="nm">Xavfsizlik Komandavoy Markazi</div><div className="sb">Sarnovul MFY · Baliqchi tumani, Andijon</div></div>
        <span className="scc-live"><i /> JONLI</span><span className="scc-demo">DEMO — namunaviy</span>
        <div className="sb mono"><Clk /></div>
      </div>

      <div className="scc-wrap">
        {/* HERO KPI */}
        <div className="scc-hero">
          <div className="scc-safe"><div style={{ fontSize: 11, color: "#9fe3c4", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px" }}>Jinoyatsiz kunlar</div><div className="big">{fmt(safeDays)}</div><div style={{ fontSize: 11.5, color: T.muted, marginTop: 6 }}>Sarnovul MFY · uzluksiz</div></div>
          <div className="scc-kpi" role="button" tabIndex={0} style={{ cursor: "pointer" }} onClick={() => setRegOpen(true)} onKeyDown={(e) => e.key === "Enter" && setRegOpen(true)}><div className="lab">Bugun o'tgan avto</div><div className="val" style={{ color: T.text }}>{fmt(passed)}</div><div style={{ fontSize: 11, marginTop: 2 }}><span style={{ color: T.alarm }}>begona: {fmt(foreign)}</span> · <span style={{ color: T.gold }}>kirim/chiqim jurnali →</span></div></div>
          <div className="scc-kpi"><div className="lab">Profilaktik hisob</div><div className="val" style={{ color: T.gold }}>{fmt(prof)}</div><div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>shaxs</div></div>
          <div className="scc-kpi"><div className="lab">Ochiq 102 murojaat</div><div className="val" style={{ color: T.teal }}>{fmt(open102)}</div><div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>ko'rib chiqilmoqda</div></div>
        </div>

        {/* ALARM */}
        {latest && (
          <div className="scc-alarm glow" style={{ marginBottom: 14 }} key={latest.id}>
            <div style={{ flex: "0 0 auto", width: 210, cursor: "pointer" }} onClick={() => setSelCar(latest)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelCar(latest)}>
              <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,77,77,.45)", aspectRatio: "16/10", background: "#05080d" }}>
                <img src={latest.img} alt="avto" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: CCTV_FILTER }} />
                <div className="scc-scan" /><div className="scc-vig" />
                <div className="rec"><i /> {latest.cam}</div><div className="clk mono">{latest.time}</div>
              </div>
              <div style={{ fontSize: 10, color: "#ffb3b3", marginTop: 4, textAlign: "center" }}>bosib batafsil ko'ring</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: 18, color: T.alarm, letterSpacing: ".5px" }}>⚠ BEGONA AVTOMOBIL — RO'YXATDA YO'Q</div>
              <div style={{ margin: "12px 0" }}><UzPlate plate={latest.plate} size="lg" /></div>
              <div style={{ fontSize: 12, color: T.muted }}>Aniqlangan: <b style={{ color: T.text }}>{latest.cam}</b> · {latest.date}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="scc-btn" style={{ borderColor: T.gold, color: T.gold }} onClick={() => setSelCar(latest)}>Batafsil</button>
                <button className="scc-btn" onClick={() => alert("DEMO: tekshirish so'rovi yuborildi")}>Tekshirish</button>
                <button className="scc-btn" onClick={() => setAlarms((p) => p.map((a) => a.id === latest.id ? { ...a, checked: true } : a))}>Belgilash</button>
              </div>
            </div>
          </div>
        )}

        {/* Kamera devori + alarm ro'yxati */}
        <div className="scc-grid" style={{ marginBottom: 14 }}>
          <div className="scc-card scc-c8" style={{ animationDelay: "120ms" }}>
            <div className="hd"><div><div className="t">Jonli kamera devori</div><div className="s">Mahalla kirish/chiqish nuqtalari · {CAMS.length} kamera</div></div><span className="scc-pill">DEMO simulyatsiya</span></div>
            <CameraWall onOpen={setSelCam} />
            <div style={{ marginTop: 12, fontSize: 11, color: T.muted, marginBottom: 4 }}>Avtomobil oqimi — real vaqtda · kartani bosing</div>
            <div className="scc-flow">{cars.map((c) => (
              <div className="scc-carc" key={c.id} role="button" tabIndex={0} style={{ cursor: "pointer" }} onClick={() => setSelCar(c)} onKeyDown={(e) => e.key === "Enter" && setSelCar(c)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><CarSil w={48} color={c.foreign ? "#c66" : "#6aa0a6"} /><span style={{ width: 8, height: 8, borderRadius: 99, background: c.foreign ? T.alarm : T.green, boxShadow: `0 0 6px ${c.foreign ? T.alarm : T.green}` }} /></div>
                <div style={{ marginTop: 4 }}><UzPlate plate={c.plate} size="sm" /></div>
                <div style={{ fontSize: 9, color: T.muted, marginTop: 4, display: "flex", justifyContent: "space-between" }}><span style={{ color: c.foreign ? T.alarm : T.green }}>{c.foreign ? "begona" : "ro'yxatda"}</span><span className="mono">{c.time}</span></div>
              </div>))}</div>
          </div>
          <div className="scc-card scc-c4" style={{ animationDelay: "200ms" }}>
            <div className="hd"><div><div className="t">Begona avtomobillar</div><div className="s">Oxirgi aniqlangan (10)</div></div></div>
            <div style={{ maxHeight: 430, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {alarms.length === 0 && <div style={{ color: T.muted, fontSize: 12, padding: 16, textAlign: "center" }}>Kuzatuv davom etmoqda…</div>}
              {alarms.map((a) => (
                <div key={a.id} role="button" tabIndex={0} onClick={() => setSelCar(a)} onKeyDown={(e) => e.key === "Enter" && setSelCar(a)} style={{ cursor: "pointer", border: `1px solid ${a.checked ? T.border : "rgba(255,77,77,.4)"}`, borderRadius: 10, padding: 8, background: a.checked ? "rgba(255,255,255,.02)" : "rgba(255,77,77,.06)", display: "flex", alignItems: "center", gap: 8 }}>
                  <UzPlate plate={a.plate} size="sm" />
                  <div style={{ flex: 1, minWidth: 0, fontSize: 10, color: T.muted }}><div style={{ color: a.checked ? T.green : T.alarm, fontWeight: 700 }}>{a.checked ? "✓ belgilangan" : "begona"}</div>{a.cam} · {a.time}</div>
                </div>))}
            </div>
          </div>
        </div>

        {/* Xavfsizlik kartalari */}
        <div className="scc-grid">
          <EPanel className="scc-c8" delay={240} height={220} title="Avtomobil oqimi — 24 soat" subtitle="Kirish / chiqish" option={flow24} note={<span className="scc-pill">DEMO</span>} />
          <EPanel className="scc-c4" delay={280} height={220} title="Begona avto tendentsiyasi" subtitle="Oxirgi 7 kun" option={foreign7} note={<span className="scc-pill">DEMO</span>} />
          <EPanel className="scc-c5" delay={320} height={210} title="Profilaktik hisob tarkibi" subtitle="34 shaxs" option={profDonut} note={<span className="scc-pill">DEMO</span>} />
          <div className="scc-card scc-c4" style={{ animationDelay: "360ms" }}>
            <div className="hd"><div><div className="t">Huquqbuzarlik xaritasi</div><div className="s">Bloklar bo'yicha xavf</div></div></div><HexMap /><div className="scc-note"><span className="scc-pill">DEMO · qizil = yuqori xavf</span></div>
          </div>
          <div className="scc-card scc-c3" style={{ animationDelay: "400ms" }}>
            <div className="hd"><div><div className="t">Himoya & profilaktika</div><div className="s">Maxsus chora-tadbirlar</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 2 }}>{[["Himoya orderlari", 5, T.teal], ["Tashvish tugmasi", 3, T.gold], ["Voyaga yetmaganlar", 4, "#7c6cf0"], ["Temir daftar oila", 4, T.green]].map(([l, n, c]) => <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 10, background: "rgba(255,255,255,.02)" }}><div className="mono" style={{ fontSize: 22, fontWeight: 700, color: c, minWidth: 34 }}>{n}</div><div style={{ fontSize: 11.5 }}>{l}</div></div>)}</div>
            <div className="scc-note"><span className="scc-pill">DEMO</span></div>
          </div>
          <div className="scc-card scc-c5" style={{ animationDelay: "440ms" }}>
            <div className="hd"><div><div className="t">102 murojaatlar holati</div><div className="s">Tezkor liniya</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>{[["Kelgan", 38, T.teal], ["Ko'rib chiqilgan", 26, T.green], ["Sudga yuborilgan", 7, T.amber], ["Ochiq", 12, T.alarm]].map(([l, n, c]) => <div key={l}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><span>{l}</span><span className="mono" style={{ color: c, fontWeight: 700 }}>{n}</span></div><div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,.07)", marginTop: 4, overflow: "hidden" }}><div style={{ width: `${(n / 38) * 100}%`, height: "100%", background: c, borderRadius: 99 }} /></div></div>)}</div>
            <div className="scc-note"><span className="scc-pill">DEMO</span></div>
          </div>
        </div>

        {/* IIB xodimlari */}
        <div className="scc-grid" style={{ marginTop: 14 }}>
          <div className="scc-card scc-c12" style={{ animationDelay: "480ms" }}>
            <div className="hd"><div><div className="t">Mahalla huquq-tartibot maskani</div><div className="s">Xodimlar tarkibi</div></div></div>
            <div className="scc-staffgrid">{[
              ["Karimov Akmal", "Profilaktika katta inspektori", "Sarnovul MFY", "xizmatda", T.green],
              ["Tursunov Sardor", "Profilaktika inspektori", "1–4-bloklar", "xizmatda", T.green],
              ["Yusupov Diyor", "Inspektor yordamchisi", "5–8-bloklar", "xizmatda", T.green],
              ["Aliyeva Nodira", "Xotin-qizlar inspektori", "MFY bo'yicha", "dam", T.muted],
              ["Sobirov Eldor", "Probatsiya inspektori", "MFY bo'yicha", "xizmatda", T.green],
              ["Nazarov Bobur", "PPX xodimi", "Patrul", "xizmatda", T.green],
            ].map(([nm, role, zona, holat, c]) => (
              <div className="scc-staffc" key={nm}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{nm}</div>
                <div style={{ fontSize: 11.5, color: T.teal }}>{role}</div>
                <div style={{ fontSize: 10.5, color: T.muted, marginTop: 3 }}>Hudud: {zona}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}><span style={{ fontSize: 10.5, color: c, fontWeight: 600 }}>● {holat}</span><button className="scc-btn" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => alert("DEMO: inspektor bilan bog'lanish")}>Bog'lanish</button></div>
              </div>))}</div>
            <div className="scc-note"><span className="scc-pill">DEMO</span></div>
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 11.5, color: T.muted }}>Barcha ma'lumotlar — <b>DEMO (namunaviy/simulyatsiya)</b>. Faqat Sarnovul MFY. Backend yo'q. Kamera tasvirlari — namunaviy real ko'cha footage'lari.</div>
      </div>
      {selCam != null && <CameraModal idx={selCam} onClose={() => setSelCam(null)} />}
      {selCar && <CarModal car={selCar} onClose={() => setSelCar(null)} />}
      {regOpen && createPortal(
        <div className="scc-modal" onClick={() => setRegOpen(false)}>
          <div className="scc-mbox" style={{ width: "min(980px,96vw)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 17 }}>Kirim / chiqim jurnali — bugun</div><div style={{ fontSize: 11, color: T.muted }}>Sarnovul MFY · qaysi avto qachon qaysi kameradan ro'yxatga olingan</div></div>
              <button className="scc-x" onClick={() => setRegOpen(false)}>×</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              {[["all", `Hammasi · ${registry.length}`], ["kirim", `Kirim · ${registry.filter((c) => c.dir === "Kirim").length}`], ["chiqim", `Chiqim · ${registry.filter((c) => c.dir === "Chiqim").length}`], ["begona", `Begona · ${registry.filter((c) => c.foreign).length}`]].map(([k, l]) => (
                <button key={k} className="scc-btn" onClick={() => setRegFilter(k)} style={regFilter === k ? { borderColor: T.gold, color: T.gold } : {}}>{l}</button>
              ))}
            </div>
            <div style={{ maxHeight: "64vh", overflowY: "auto" }}>
              <table className="scc-tbl"><thead><tr><th>Davlat raqami</th><th>Vaqt</th><th>Kamera</th><th>Yo'nalish</th><th>Holat</th></tr></thead>
                <tbody>{registry.filter((c) => regFilter === "all" || (regFilter === "kirim" && c.dir === "Kirim") || (regFilter === "chiqim" && c.dir === "Chiqim") || (regFilter === "begona" && c.foreign)).map((c) => (
                  <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => setSelCar(c)}>
                    <td><UzPlate plate={c.plate} size="sm" /></td>
                    <td className="mono">{c.time}</td>
                    <td style={{ color: T.muted }}>{c.cam}</td>
                    <td><span className="scc-pill" style={c.dir === "Kirim" ? { background: "rgba(47,191,135,.16)", color: T.green } : { background: "rgba(224,169,59,.16)", color: T.gold }}>{c.dir === "Kirim" ? "→ Kirim" : "← Chiqim"}</span></td>
                    <td><span className="scc-pill" style={c.foreign ? { background: "rgba(255,77,77,.16)", color: T.alarm } : { background: "rgba(47,191,135,.16)", color: T.green }}>{c.foreign ? "begona" : "ro'yxatda"}</span></td>
                  </tr>))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10 }}><span className="scc-pill">DEMO · qatorni bosing — avto tafsiloti (rasm + kamera)</span></div>
          </div>
        </div>, document.body)}
    </div>
  );
};

function Clk() { return <span>{useClock()}</span>; }

export default IibDashboardPage;
