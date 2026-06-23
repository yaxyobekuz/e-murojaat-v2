// Mahalla Ta'lim Monitoringi — yagona sahifali davlat dashboardi (Navbahor MFY).
// Faqat topbar, Chart.js v4 (CDN), Mahalla/Milliy almashtirgich, sana filtri,
// har chart kengaytiriladigan (modal + zoom). Mahalla — namunaviy, milliy — real.
import { useEffect, useMemo, useRef, useState } from "react";

/* ─────────────────────────── Ranglar / shrift ─────────────────────────── */
const C = { navy: "#0F2D3C", gold: "#C28A2C", green: "#1F9D6B", amber: "#D99A2B", red: "#D14B47", bg: "#EEF1F4", card: "#FFFFFF", text: "#16242b", muted: "#5b6b73", line: "#e2e7ec" };

/* ─────────────────────── Kutubxonalar (CDN) yuklash ────────────────────── */
const addScript = (src) => new Promise((res) => { if ([...document.scripts].some((s) => s.src === src)) return res(); const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = res; document.head.appendChild(s); });
const ensureFonts = () => {
  if (document.getElementById("talim-fonts")) return;
  const l = document.createElement("link"); l.id = "talim-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
};
const ensureLibs = async () => {
  ensureFonts();
  if (window.Chart) return true;
  await addScript("https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js");
  await addScript("https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/hammer.min.js");
  await addScript("https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.min.js");
  try { const z = window["chartjs-plugin-zoom"] || window.ChartZoom; if (window.Chart && z) window.Chart.register(z.default || z); } catch { /* zoom ixtiyoriy */ }
  return !!window.Chart;
};
const fmt = (n) => Number(n).toLocaleString("uz-UZ").replace(/,/g, " ");

/* ──────────────────────────── Ma'lumotlar ─────────────────────────────── */
// Determinik "tasodif" (seed)
const rng = (s) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

// MAHALLA — namunaviy (sintetik)
const SCHOOLS = [
  { name: "12-maktab", students: 1240, type: "Davlat" },
  { name: "47-maktab", students: 980, type: "Davlat" },
  { name: "Bilim xususiy maktabi", students: 320, type: "Xususiy" },
];
const MAHALLA = {
  name: "Navbahor MFY", area: "Yunusobod tumani, Toshkent",
  total: 2540, present: 2392, excused: 89, absent: 59,
};
MAHALLA.rate = +((MAHALLA.present / MAHALLA.total) * 100).toFixed(1);
SCHOOLS.forEach((s, i) => { s.rate = +(91 + rng(i + 3) * 6).toFixed(1); s.att = Math.round((s.students * s.rate) / 100); });

// Sinflar 1–11 davomati
const CLASSES = Array.from({ length: 11 }, (_, i) => ({ grade: i + 1, rate: +(90 + rng(i * 5 + 2) * 8).toFixed(1) }));
// Oxirgi 30 kun davomat trendi
const dayLabel = (back) => { const d = new Date(2026, 5, 24); d.setDate(d.getDate() - back); return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`; };
const TREND = Array.from({ length: 30 }, (_, i) => ({ d: dayLabel(29 - i), v: +(92 + rng(i * 3 + 1) * 5).toFixed(1) }));
// Tarkib
const MALE = 1295, FEMALE = MAHALLA.total - MALE;
const STATE = SCHOOLS.filter((s) => s.type === "Davlat").reduce((a, s) => a + s.students, 0);
const PRIVATE = MAHALLA.total - STATE;

// MILLIY — real (manbalar TZ da)
const NATIONAL = {
  total: 6776300, teachers: 564900, firstGrade: 726231, online: 209280, graduates: 455200, privateStudents: 112093, secondThirdShift: 75.5,
  history: [["1990/91", 4655.5], ["2000/01", 6017.6], ["2010/11", 4695.3], ["2020/21", 6287.9], ["2023/24", 6645.1], ["2024/25", 6776.3]],
  regions: [["Samarqand", 720], ["Farg'ona", 690], ["Qashqadaryo", 680], ["Surxondaryo", 560], ["Andijon", 560], ["Toshkent sh.", 550], ["Toshkent vil.", 540], ["Namangan", 540], ["Buxoro", 410], ["Qoraqalpog'iston", 420], ["Xorazm", 400], ["Jizzax", 300], ["Navoiy", 230], ["Sirdaryo", 200]],
};

/* ─────────────────────────── Scoped CSS ───────────────────────────────── */
const CSS = `
.tlm{font-family:Inter,system-ui,sans-serif;background:${C.bg};color:${C.text};min-height:100%;padding-bottom:32px}
.tlm h1,.tlm h2,.tlm h3,.tlm .ttl{font-family:Archivo,Inter,sans-serif}
.tlm *{box-sizing:border-box}
.tlm-top{position:sticky;top:0;z-index:20;background:${C.navy};color:#fff;display:flex;align-items:center;gap:16px;padding:12px 20px;flex-wrap:wrap}
.tlm-emb{width:38px;height:38px;border-radius:9px;background:linear-gradient(135deg,${C.gold},#9c6d1f);display:grid;place-items:center;font-weight:800;color:#fff;font-family:Archivo}
.tlm-top .name{font-weight:800;font-size:16px;letter-spacing:.3px;font-family:Archivo}
.tlm-top .sub{font-size:11px;color:#b9c6cd}
.tlm-seg{display:inline-flex;background:rgba(255,255,255,.1);border-radius:999px;padding:3px}
.tlm-seg button{border:0;background:transparent;color:#cdd8de;font-weight:600;font-size:12.5px;padding:6px 16px;border-radius:999px;cursor:pointer;font-family:Inter}
.tlm-seg button[aria-pressed=true]{background:${C.gold};color:#1a1205}
.tlm-sel{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:7px 10px;font-size:12.5px;font-family:Inter}
.tlm-wrap{padding:18px 20px;max-width:1500px;margin:0 auto}
.tlm-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:16px}
.tlm-kpi{background:${C.card};border:1px solid ${C.line};border-radius:14px;padding:14px 16px;box-shadow:0 1px 3px rgba(15,45,60,.06)}
.tlm-kpi .lab{font-size:11px;color:${C.muted};font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.tlm-kpi .val{font-size:24px;font-weight:800;font-family:Archivo;margin-top:4px;font-variant-numeric:tabular-nums}
.tlm-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
.tlm-card{background:${C.card};border:1px solid ${C.line};border-radius:16px;padding:14px 16px;box-shadow:0 1px 3px rgba(15,45,60,.06);display:flex;flex-direction:column;min-width:0}
.tlm-card .hd{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:10px}
.tlm-card .hd .t{font-weight:700;font-size:14.5px;font-family:Archivo;color:${C.navy}}
.tlm-card .hd .s{font-size:11.5px;color:${C.muted}}
.tlm-exp{border:1px solid ${C.line};background:#f6f8fa;border-radius:8px;width:30px;height:30px;display:grid;place-items:center;cursor:pointer;color:${C.navy};flex:0 0 auto}
.tlm-exp:hover{background:#eef1f4}
.tlm-cv{position:relative;flex:1;min-height:200px}
.tlm-note{font-size:11px;color:${C.muted};margin-top:8px}
.tlm-pill{display:inline-block;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:999px;background:#fbe9c9;color:#8a5e15}
.tlm-tbl{width:100%;border-collapse:collapse;font-size:13px}
.tlm-tbl th{text-align:left;color:${C.muted};font-weight:600;font-size:11px;text-transform:uppercase;padding:8px 6px;border-bottom:1px solid ${C.line}}
.tlm-tbl td{padding:9px 6px;border-bottom:1px solid #f1f4f7}
.tlm-bar{height:7px;border-radius:99px;background:#eef1f4;overflow:hidden}
.tlm-bar>i{display:block;height:100%;border-radius:99px;background:${C.green}}
.tlm-nat{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.tlm-nat .it{background:#f7f9fb;border:1px solid ${C.line};border-radius:11px;padding:10px 12px}
.tlm-nat .it .v{font-size:18px;font-weight:800;font-family:Archivo;color:${C.navy};font-variant-numeric:tabular-nums}
.tlm-nat .it .l{font-size:11px;color:${C.muted};margin-top:2px}
.tlm-modal{position:fixed;inset:0;z-index:60;background:rgba(8,20,28,.55);display:grid;place-items:center;padding:18px;backdrop-filter:blur(2px)}
.tlm-mbox{background:${C.card};border-radius:18px;width:min(1100px,96vw);height:min(82vh,820px);display:flex;flex-direction:column;padding:16px 18px;box-shadow:0 30px 80px rgba(0,0,0,.4)}
.tlm-mbox .mh{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.tlm-mbox .mc{flex:1;position:relative;min-height:0}
.tlm-x{border:1px solid ${C.line};background:#f6f8fa;border-radius:8px;width:34px;height:34px;cursor:pointer;color:${C.navy};font-size:18px}
.tlm-c4{grid-column:span 4}.tlm-c5{grid-column:span 5}.tlm-c6{grid-column:span 6}.tlm-c7{grid-column:span 7}.tlm-c8{grid-column:span 8}.tlm-c12{grid-column:span 12}
.tlm a:focus-visible,.tlm button:focus-visible,.tlm select:focus-visible{outline:3px solid ${C.gold};outline-offset:2px;border-radius:8px}
@media(max-width:1100px){.tlm-kpis{grid-template-columns:repeat(3,1fr)}.tlm-c4,.tlm-c5,.tlm-c6,.tlm-c7,.tlm-c8{grid-column:span 12}}
@media(max-width:640px){.tlm-kpis{grid-template-columns:repeat(2,1fr)}.tlm-wrap{padding:14px}}
@media(prefers-reduced-motion:reduce){.tlm *{animation:none!important;transition:none!important}}
`;

/* ──────────────────────────── Chart kartasi ───────────────────────────── */
const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const baseOpts = { responsive: true, maintainAspectRatio: false, animation: reduceMotion ? false : { duration: 600 }, plugins: { legend: { labels: { font: { family: "Inter", size: 11 }, color: C.text } } } };

function ChartCard({ title, subtitle, note, span = "tlm-c6", config, ready }) {
  const cv = useRef(null); const ch = useRef(null);
  const mcv = useRef(null); const mch = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready || !cv.current || !window.Chart) return;
    ch.current?.destroy();
    ch.current = new window.Chart(cv.current, JSON.parse(JSON.stringify(config)));
    return () => ch.current?.destroy();
  }, [ready, config]);

  useEffect(() => {
    if (!open || !ready || !mcv.current || !window.Chart) return;
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.options = cfg.options || {}; cfg.options.plugins = cfg.options.plugins || {};
    cfg.options.plugins.zoom = { zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "xy" }, pan: { enabled: true, mode: "xy" } };
    mch.current = new window.Chart(mcv.current, cfg);
    return () => mch.current?.destroy();
  }, [open, ready, config]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`tlm-card ${span}`}>
      <div className="hd">
        <div><div className="t">{title}</div>{subtitle && <div className="s">{subtitle}</div>}</div>
        <button className="tlm-exp" title="Kengaytirish" aria-label={`${title} — kengaytirish`} onClick={() => setOpen(true)}>⤢</button>
      </div>
      <div className="tlm-cv"><canvas ref={cv} /></div>
      {note && <div className="tlm-note">{note}</div>}
      {open && (
        <div className="tlm-modal" role="dialog" aria-modal="true" aria-label={title} onClick={() => setOpen(false)}>
          <div className="tlm-mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mh"><div><div className="t" style={{ fontFamily: "Archivo", fontWeight: 700, fontSize: 17, color: C.navy }}>{title}</div><div className="s" style={{ fontSize: 12, color: C.muted }}>G'ildirak bilan zoom · sudrab pan · Esc — yopish</div></div><button className="tlm-x" aria-label="Yopish" onClick={() => setOpen(false)}>×</button></div>
            <div className="mc"><canvas ref={mcv} /></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── Asosiy sahifa ───────────────────────────── */
const TalimDashboardPage = () => {
  const [ready, setReady] = useState(!!(typeof window !== "undefined" && window.Chart));
  const [view, setView] = useState("mahalla"); // mahalla | milliy
  const [days, setDays] = useState(14);

  useEffect(() => { let on = true; ensureLibs().then((ok) => on && setReady(ok)); return () => { on = false; }; }, []);
  useEffect(() => { if (document.getElementById("tlm-style")) return; const st = document.createElement("style"); st.id = "tlm-style"; st.textContent = CSS; document.head.appendChild(st); }, []);

  const milliy = view === "milliy";

  // KPI lentasi
  const kpis = milliy
    ? [
        { lab: "Jami o'quvchi", val: fmt(NATIONAL.total) },
        { lab: "O'qituvchilar", val: fmt(NATIONAL.teachers) },
        { lab: "1-sinf qabul", val: fmt(NATIONAL.firstGrade) },
        { lab: "Onlayn qabul", val: fmt(NATIONAL.online) },
        { lab: "Bitiruvchilar", val: fmt(NATIONAL.graduates) },
        { lab: "Xususiyda", val: fmt(NATIONAL.privateStudents) },
      ]
    : [
        { lab: "Jami o'quvchi", val: fmt(MAHALLA.total) },
        { lab: "Bugungi davomat", val: `${MAHALLA.rate}%`, color: C.green },
        { lab: "Kelgan", val: fmt(MAHALLA.present), color: C.green },
        { lab: "Sababli", val: fmt(MAHALLA.excused), color: C.amber },
        { lab: "Sababsiz", val: fmt(MAHALLA.absent), color: C.red },
        { lab: "Maktablar", val: SCHOOLS.length },
      ];

  // Chart konfiguratsiyalari (view/days ga bog'liq)
  const donut = useMemo(() => ({
    type: "doughnut",
    data: { labels: ["Kelgan", "Sababli", "Sababsiz"], datasets: [{ data: [MAHALLA.present, MAHALLA.excused, MAHALLA.absent], backgroundColor: [C.green, C.amber, C.red], borderWidth: 2, borderColor: "#fff" }] },
    options: { ...baseOpts, cutout: "62%", plugins: { ...baseOpts.plugins, legend: { position: "bottom", labels: { font: { family: "Inter", size: 11 } } } } },
  }), []);

  const trend = useMemo(() => {
    const slice = TREND.slice(30 - days);
    return {
      type: "line",
      data: { labels: slice.map((t) => t.d), datasets: [{ label: "Davomat %", data: slice.map((t) => t.v), borderColor: C.green, backgroundColor: "rgba(31,157,107,.12)", fill: true, tension: .35, pointRadius: 2, borderWidth: 2 }] },
      options: { ...baseOpts, scales: { y: { suggestedMin: 85, suggestedMax: 100, ticks: { callback: (v) => v + "%" } } }, plugins: { ...baseOpts.plugins, legend: { display: false } } },
    };
  }, [days]);

  const classes = useMemo(() => ({
    type: "bar",
    data: { labels: CLASSES.map((c) => `${c.grade}`), datasets: [{ label: "Davomat %", data: CLASSES.map((c) => c.rate), backgroundColor: CLASSES.map((c) => (c.rate >= 94 ? C.green : c.rate >= 90 ? C.gold : C.amber)), borderRadius: 5 }] },
    options: { ...baseOpts, scales: { y: { suggestedMin: 80, suggestedMax: 100, ticks: { callback: (v) => v + "%" } }, x: { title: { display: true, text: "Sinf", color: C.muted } } }, plugins: { ...baseOpts.plugins, legend: { display: false } } },
  }), []);

  const composition = useMemo(() => {
    const g = milliy ? [Math.round(NATIONAL.total * 0.51), Math.round(NATIONAL.total * 0.49)] : [MALE, FEMALE];
    const t = milliy ? [NATIONAL.total - NATIONAL.privateStudents, NATIONAL.privateStudents] : [STATE, PRIVATE];
    return {
      type: "bar",
      data: { labels: ["O'g'il", "Qiz", "Davlat", "Xususiy"], datasets: [{ data: [g[0], g[1], t[0], t[1]], backgroundColor: [C.navy, C.gold, "#3a6b7e", "#9fb6c0"], borderRadius: 5 }] },
      options: { ...baseOpts, plugins: { ...baseOpts.plugins, legend: { display: false } }, scales: { y: { ticks: { callback: (v) => fmt(v) } } } },
    };
  }, [milliy]);

  const dynamics = useMemo(() => ({
    type: "line",
    data: { labels: NATIONAL.history.map((h) => h[0]), datasets: [{ label: "O'quvchilar (ming)", data: NATIONAL.history.map((h) => h[1]), borderColor: C.navy, backgroundColor: "rgba(15,45,60,.10)", fill: true, tension: .3, pointRadius: 3, borderWidth: 2 }] },
    options: { ...baseOpts, plugins: { ...baseOpts.plugins, legend: { display: false } }, scales: { y: { ticks: { callback: (v) => fmt(v) } } } },
  }), []);

  const regions = useMemo(() => ({
    type: "bar",
    data: { labels: NATIONAL.regions.map((r) => r[0]), datasets: [{ label: "O'quvchilar (ming)", data: NATIONAL.regions.map((r) => r[1]), backgroundColor: C.gold, borderRadius: 4 }] },
    options: { ...baseOpts, indexAxis: "y", plugins: { ...baseOpts.plugins, legend: { display: false } } },
  }), []);

  return (
    <div className="tlm">
      {/* TOPBAR */}
      <div className="tlm-top">
        <div className="tlm-emb">UT</div>
        <div style={{ marginRight: "auto" }}>
          <div className="name">Mahalla Ta'lim Monitoringi</div>
          <div className="sub">{MAHALLA.name} · {MAHALLA.area}</div>
        </div>
        <div className="tlm-seg" role="group" aria-label="Ko'rinish">
          <button aria-pressed={!milliy} onClick={() => setView("mahalla")}>Mahalla</button>
          <button aria-pressed={milliy} onClick={() => setView("milliy")}>Milliy</button>
        </div>
        <label className="sub" style={{ display: "flex", alignItems: "center", gap: 6 }}>Davr:
          <select className="tlm-sel" value={days} onChange={(e) => setDays(+e.target.value)} aria-label="Sana filtri">
            <option value={7}>7 kun</option><option value={14}>14 kun</option><option value={30}>30 kun</option>
          </select>
        </label>
        <div className="sub" style={{ fontVariantNumeric: "tabular-nums" }}>24.06.2026</div>
      </div>

      <div className="tlm-wrap">
        {/* 1) KPI lentasi */}
        <div className="tlm-kpis">
          {kpis.map((k, i) => (
            <div className="tlm-kpi" key={i}><div className="lab">{k.lab}</div><div className="val" style={{ color: k.color || C.navy }}>{k.val}</div></div>
          ))}
        </div>

        {!ready && <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Chartlar yuklanmoqda…</div>}

        <div className="tlm-grid">
          {/* 2) Bugungi davomat — donut */}
          <ChartCard span="tlm-c4" ready={ready} title="Bugungi davomat" subtitle="Kelgan / Sababli / Sababsiz" config={donut}
            note={<span><span className="tlm-pill">namunaviy</span> &nbsp;Jami {fmt(MAHALLA.total)} · davomat {MAHALLA.rate}%</span>} />
          {/* 3) Davomat tendentsiyasi — line */}
          <ChartCard span="tlm-c8" ready={ready} title="Davomat tendentsiyasi" subtitle={`Oxirgi ${days} kun`} config={trend} note={<span className="tlm-pill">namunaviy</span>} />
          {/* 4) Sinflar bo'yicha davomat */}
          <ChartCard span="tlm-c6" ready={ready} title="Sinflar bo'yicha davomat" subtitle="1–11-sinf" config={classes} note={<span className="tlm-pill">namunaviy</span>} />
          {/* 5) O'quvchilar tarkibi */}
          <ChartCard span="tlm-c6" ready={ready} title="O'quvchilar tarkibi" subtitle={milliy ? "Milliy — jins va maktab turi" : "Jins va maktab turi"} config={composition}
            note={milliy ? "Milliy: xususiy 112 093 (real); jins taqsimoti taxminiy" : <span className="tlm-pill">namunaviy</span>} />

          {/* 6) Maktablar ro'yxati */}
          <div className="tlm-card tlm-c5">
            <div className="hd"><div><div className="t">Mahalladagi maktablar</div><div className="s">{MAHALLA.name}</div></div><span className="tlm-pill">namunaviy</span></div>
            <table className="tlm-tbl">
              <thead><tr><th>Maktab</th><th>Turi</th><th style={{ textAlign: "right" }}>O'quvchi</th><th style={{ width: 120 }}>Davomat</th></tr></thead>
              <tbody>
                {SCHOOLS.map((s) => (
                  <tr key={s.name}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ color: C.muted }}>{s.type}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(s.students)}</td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="tlm-bar" style={{ flex: 1 }}><i style={{ width: `${s.rate}%`, background: s.rate >= 94 ? C.green : C.amber }} /></div><span style={{ fontWeight: 700, fontSize: 12 }}>{s.rate}%</span></div></td>
                  </tr>
                ))}
                <tr><td style={{ fontWeight: 800 }}>Jami</td><td /><td style={{ textAlign: "right", fontWeight: 800 }}>{fmt(MAHALLA.total)}</td><td style={{ fontWeight: 800 }}>{MAHALLA.rate}%</td></tr>
              </tbody>
            </table>
          </div>

          {/* 7) Milliy ko'rsatkichlar */}
          <div className="tlm-card tlm-c7">
            <div className="hd"><div><div className="t">Milliy ko'rsatkichlar</div><div className="s">O'zbekiston umumiy ta'limi (real, 2024/25–2025/26)</div></div><span className="tlm-pill" style={{ background: "#d7ece2", color: "#176b4b" }}>real</span></div>
            <div className="tlm-nat">
              <div className="it"><div className="v">{fmt(NATIONAL.total)}</div><div className="l">Jami o'quvchilar (2024/25)</div></div>
              <div className="it"><div className="v">{fmt(NATIONAL.teachers)}</div><div className="l">O'qituvchilar (o'rindoshlarsiz)</div></div>
              <div className="it"><div className="v">{fmt(NATIONAL.firstGrade)}</div><div className="l">1-sinfga qabul (2025/26)</div></div>
              <div className="it"><div className="v">{fmt(NATIONAL.online)}</div><div className="l">Onlayn qabul</div></div>
              <div className="it"><div className="v">{fmt(NATIONAL.graduates)}</div><div className="l">Bitiruvchilar (2024/25)</div></div>
              <div className="it"><div className="v">{fmt(NATIONAL.privateStudents)}</div><div className="l">Xususiy maktab o'quvchilari</div></div>
              <div className="it"><div className="v">+660</div><div className="l">5 yilda maktablar · 14 prezident, 9 ijod, 182 ixtisos.</div></div>
              <div className="it"><div className="v">{NATIONAL.secondThirdShift}%</div><div className="l">2–3 smenada o'qiydigan maktablar</div></div>
            </div>
          </div>

          {/* 8) O'quvchilar dinamikasi 1990–2025 */}
          <ChartCard span="tlm-c7" ready={ready} title="O'quvchilar soni dinamikasi" subtitle="1990–2025 (ming)" config={dynamics} note={<span className="tlm-pill" style={{ background: "#d7ece2", color: "#176b4b" }}>real</span>} />
          {/* 9) Hududlar bo'yicha taqsimot */}
          <ChartCard span="tlm-c5" ready={ready} title="Hududlar bo'yicha taqsimot" subtitle="O'quvchilar (ming)" config={regions} note={<span className="tlm-pill">taxminiy taqsimot</span>} />
        </div>

        <div style={{ marginTop: 18, fontSize: 11.5, color: C.muted }}>
          Mahalla darajasidagi raqamlar — <b>namunaviy (sintetik)</b>. Milliy raqamlar — manbalar asosida real (Xabar, Anhor, Daryo, Kun.uz, Kursiv).
        </div>
      </div>
    </div>
  );
};

export default TalimDashboardPage;
