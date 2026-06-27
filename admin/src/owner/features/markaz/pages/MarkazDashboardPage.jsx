// Boshqaruv markazi — IIB + FVV + Ta'lim yagona panel (2×2, 4 grid).
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { T, useInjectCC, useCountUp, CcTop, MiniChart, tip, lineOpt, barOpt } from "@/owner/features/talim/cc";
import { M, STUDENTS, fmt, trend30, dayLabel } from "@/owner/features/talim/data";

const pad = (n) => String(n).padStart(2, "0");
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const L = () => "ABCDEFHIKLMNOPRSTUVXYZ"[ri(0, 21)];
const plate = () => `${pad(ri(1, 95))} ${L()} ${ri(100, 999)} ${L()}${L()}`;
const STREETS = ["Sarnovul", "Bog'", "Navbahor", "Guliston", "Mustaqillik", "Do'stlik", "Bahor", "Yangiobod"];
const SCHOOLS = ["12-maktab", "47-maktab", "Bilim xususiy maktabi"];

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => { const f = () => { const d = new Date(); setT(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`); }; f(); const id = setInterval(f, 1000); return () => clearInterval(id); }, []);
  return t;
}

/* ───────── 1-GRID: Umumiy ma'lumotlar (kartalar) ───────── */
const STATS = [
  { ic: "🎓", n: 2540, lab: "O'quvchilar", sub: "6–18 yosh · maktablarda", c: T.teal },
  { ic: "🧑‍🎓", n: 1820, lab: "Yoshlar (14–30)", sub: "mahalla bo'yicha", c: T.gold },
  { ic: "📓", n: 96, lab: "Yoshlar daftarida", sub: "maxsus monitoring", c: T.amber },
  { ic: "💼", n: 73, lab: "Bitirgan, ishsiz yoshlar", sub: "maktabni tugatgan", c: T.alarm },
  { ic: "🏫", n: 3, lab: "Maktablar", sub: "2 davlat · 1 xususiy", c: T.green },
  { ic: "🏠", n: 1240, lab: "Xonadonlar", sub: "FVV nazoratida", c: T.teal },
  { ic: "🔥", n: 28, lab: "Xavfli obyektlar", sub: "FVV — yong'in xavfi", c: T.alarm },
  { ic: "📹", n: 14, lab: "Kameralar", sub: "IIB · ko'cha · maktab", c: T.gold },
];
function StatCard({ s }) {
  const v = useCountUp(s.n, 1400);
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 13, padding: "13px 14px", background: "rgba(255,255,255,.02)", display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 17 }}>{s.ic}</span><span className="mono" style={{ fontSize: 26, fontWeight: 700, color: s.c }}>{fmt(v)}</span></div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{s.lab}</div>
      <div style={{ fontSize: 11, color: T.muted }}>{s.sub}</div>
    </div>
  );
}
function GridUmumiy() {
  return (
    <Section title="Umumiy ma'lumotlar" subtitle="Mahalla bo'yicha jami ko'rsatkichlar" badge="1">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 11 }}>
        {STATS.map((s) => <StatCard key={s.lab} s={s} />)}
      </div>
    </Section>
  );
}

/* ───────── 2-GRID: Statistikalar (Maktab / FVV / IIB) ───────── */
function StatBlock({ icon, title, kpi, kpiColor, children }) {
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 13, padding: "11px 12px 6px", background: "rgba(255,255,255,.02)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{icon} {title}</div>
        <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: kpiColor }}>{kpi}</div>
      </div>
      {children}
    </div>
  );
}
function GridStatistika() {
  const schoolLine = lineOpt(trend30(1).slice(16), Array.from({ length: 14 }, (_, i) => dayLabel(13 - i)), T.green);
  const carBar = barOpt(["06", "08", "10", "12", "14", "16", "18"], [22, 58, 47, 39, 51, 71, 44], T.teal);
  const fvvDonut = { backgroundColor: "transparent", tooltip: { trigger: "item", ...tip }, legend: { bottom: 0, textStyle: { color: T.muted, fontSize: 10 }, icon: "circle", itemWidth: 8 }, series: [{ type: "pie", radius: ["50%", "74%"], center: ["50%", "42%"], label: { show: false }, data: [{ value: 6, name: "Tibbiy", itemStyle: { color: T.teal } }, { value: 4, name: "Yong'in", itemStyle: { color: T.alarm } }, { value: 3, name: "Gaz", itemStyle: { color: T.amber } }, { value: 2, name: "Tabiiy", itemStyle: { color: T.gold } }] }] };
  return (
    <Section title="Statistikalar" subtitle="Maktab · FVV · IIB kesimida" badge="2">
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <StatBlock icon="🏫" title="Maktab — davomat (14 kun)" kpi="94.6%" kpiColor={T.green}><MiniChart option={schoolLine} height={92} /></StatBlock>
        <StatBlock icon="🔥" title="FVV — hodisalar (30 kun)" kpi="15 ta" kpiColor={T.amber}><MiniChart option={fvvDonut} height={110} /></StatBlock>
        <StatBlock icon="🚓" title="IIB — avto oqimi (bugun)" kpi="332" kpiColor={T.teal}><MiniChart option={carBar} height={92} /></StatBlock>
      </div>
    </Section>
  );
}

/* ───────── 3-GRID: Barcha kameralar (50+ · default faqat ogohlantirishlilar) ───────── */
const vid = (id, f) => `https://videos.pexels.com/video-files/${id}/${f}.mp4`;
const CCTV = "grayscale(.32) contrast(1.16) brightness(.9) saturate(.7)";
const VIDS = [
  vid(2034115, "2034115-sd_640_360_30fps"), vid(5921059, "5921059-sd_640_360_30fps"), vid(1721294, "1721294-sd_640_360_25fps"),
  vid(857195, "857195-sd_640_360_25fps"), vid(2099536, "2099536-sd_640_360_30fps"), vid(854671, "854671-sd_640_360_25fps"),
];
const CAM_DEFS = [
  { group: "Mahalla kirishi", c: T.teal, places: ["Sarnovul kirishi", "Bog' kirishi", "Markaziy kirishi", "Shimoliy post", "Janubiy post"] },
  { group: "IIB post", c: T.teal, places: ["MFY posti", "Markaziy chorraha", "Bozor posti", "Avtoturargoh", "Park posti", "Tungi post"] },
  { group: "Ko'cha", c: T.gold, places: STREETS.flatMap((s) => [`${s} ko'chasi (boshi)`, `${s} ko'chasi (o'rtasi)`, `${s} ko'chasi (oxiri)`]) },
  { group: "Maktab", c: T.green, places: ["12-maktab darvoza", "12-maktab hovli", "12-maktab koridor", "12-maktab oshxona", "47-maktab darvoza", "47-maktab hovli", "47-maktab koridor", "Bilim maktabi kirish", "Bilim maktabi hovli"] },
  { group: "Jamoat", c: T.gold, places: ["Bozor ichi", "Bozor kirishi", "Park markaz", "Stadion", "Poliklinika", "Bog'cha-14", "Suv ombori", "Transformator", "Mahalla idora"] },
];
const ALL_CAMERAS = [];
let _cn = 1;
CAM_DEFS.forEach((d) => d.places.forEach((p) => { ALL_CAMERAS.push({ id: _cn, code: `CAM-${pad(_cn)}`, name: p, group: d.group, c: d.c, src: VIDS[(_cn - 1) % VIDS.length], warn: null }); _cn++; }));
const WARN_DEFS = [
  [2, "Begona avtomobil", T.red], [8, "To'planish aniqlandi", T.alarm], [13, "Aloqa uzildi", T.muted],
  [20, "Ruxsatsiz harakat", T.alarm], [26, "Tungi harakat", T.amber], [31, "Begona avtomobil", T.red],
  [37, "Aloqa uzildi", T.muted], [42, "Yong'in tutuni", T.alarm], [46, "Ruxsatsiz kirish", T.alarm],
];
WARN_DEFS.forEach(([i, label, color]) => { const cam = ALL_CAMERAS[i % ALL_CAMERAS.length]; if (cam) cam.warn = { label, color }; });

function CameraTile({ cam, clk }) {
  const w = cam.warn;
  return (
    <div style={{ position: "relative", aspectRatio: "16/10", borderRadius: 10, overflow: "hidden", border: `1px solid ${w ? w.color : T.border}`, background: "#000", boxShadow: w ? `0 0 14px -3px ${w.color}` : "none" }}>
      <video src={cam.src} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: CCTV }} />
      <div style={{ position: "absolute", top: 6, left: 7, fontSize: 9, fontWeight: 700, color: "#ff6a6a", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4d4d", boxShadow: "0 0 6px #ff4d4d" }} />REC</div>
      <div className="mono" style={{ position: "absolute", top: 6, right: 7, fontSize: 9.5, color: "#cfe", textShadow: "0 1px 2px #000" }}>{clk}</div>
      {w && <div style={{ position: "absolute", top: 22, left: 7, right: 7, fontSize: 9, fontWeight: 700, color: "#fff", background: w.color, borderRadius: 5, padding: "2px 5px", textAlign: "center" }}>⚠ {w.label}</div>}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 7px 5px", background: "linear-gradient(transparent, rgba(5,8,13,.88))" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cam.code} · {cam.name}</div>
        <div style={{ fontSize: 8.5, fontWeight: 700, color: cam.c, textTransform: "uppercase", letterSpacing: ".4px" }}>{cam.group}</div>
      </div>
    </div>
  );
}

function CameraModal({ onClose, clk }) {
  const groups = ["Hammasi", ...Array.from(new Set(ALL_CAMERAS.map((c) => c.group)))];
  const [grp, setGrp] = useState("Hammasi");
  const list = grp === "Hammasi" ? ALL_CAMERAS : ALL_CAMERAS.filter((c) => c.group === grp);
  const cnt = (g) => (g === "Hammasi" ? ALL_CAMERAS.length : ALL_CAMERAS.filter((c) => c.group === g).length);
  return createPortal(
    <div className="tcc-modal" onClick={onClose}>
      <div className="tcc-mbox" onClick={(e) => e.stopPropagation()} style={{ width: "min(1280px,97vw)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div><div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 17 }}>Barcha kameralar — to'liq ro'yxat</div><div style={{ fontSize: 11.5, color: T.muted }}>{M.name} · jami {ALL_CAMERAS.length} kamera · joylashuv bo'yicha filtr</div></div>
          <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.text, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
          {groups.map((g) => (
            <button key={g} onClick={() => setGrp(g)} style={{ cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 9, border: `1px solid ${grp === g ? T.teal : T.border}`, background: grp === g ? "rgba(45,212,191,.14)" : "transparent", color: grp === g ? T.teal : T.muted }}>{g} <span className="mono" style={{ opacity: .7 }}>{cnt(g)}</span></button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10 }}>
          {list.map((c) => <CameraTile key={c.id} cam={c} clk={clk} />)}
        </div>
      </div>
    </div>, document.body);
}

function GridKameralar() {
  const clk = useClock();
  const [open, setOpen] = useState(false);
  const warnCams = ALL_CAMERAS.filter((c) => c.warn);
  return (
    <Section title="Barcha kameralar" subtitle={`Jami ${ALL_CAMERAS.length} kamera · ${warnCams.length} ogohlantirish`} badge="3"
      action={<button onClick={() => setOpen(true)} style={{ cursor: "pointer", fontSize: 11.5, fontWeight: 600, padding: "5px 11px", borderRadius: 8, border: `1px solid ${T.teal}`, background: "rgba(45,212,191,.12)", color: T.teal }}>⤢ To'liq ro'yxat</button>}>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 9 }}>Faqat <b style={{ color: T.alarm }}>ogohlantirishli</b> kameralar ko'rsatilgan. To'liq ro'yxat va joylashuv bo'yicha filtr uchun <b style={{ color: T.teal }}>“To'liq ro'yxat”</b>.</div>
      {warnCams.length === 0 ? <div style={{ fontSize: 12.5, color: T.green, padding: 8 }}>✓ Ogohlantirish yo'q — barcha kameralar normal.</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 9 }}>
          {warnCams.map((c) => <CameraTile key={c.id} cam={c} clk={clk} />)}
        </div>
      )}
      {open && <CameraModal onClose={() => setOpen(false)} clk={clk} />}
    </Section>
  );
}

/* ───────── 4-GRID: Barcha bildirishnomalar ───────── */
const NOTIF_KINDS = [
  () => { const s = pick(STUDENTS); return { mod: "Ta'lim", c: T.alarm, ic: "🎓", title: `${s.name} — ${pick(SCHOOLS)} ${s.grade}-${s.letter}`, sub: "Bugun maktabga kelmadi (Face-ID yo'q)" }; },
  () => ({ mod: "FVV", c: T.amber, ic: "🔥", title: `${pick(STREETS)} ko'chasi ${ri(1, 80)}-uy`, sub: "Yong'in/tutun xavfi — sensor signal berdi" }),
  () => ({ mod: "IIB", c: T.red, ic: "🚗", title: `${plate()} · begona avtomobil`, sub: `${pick(["Mahalla kirishi", "Markaziy chorraha", "Bog' ko'chasi"])} — ro'yxatda yo'q` }),
  () => ({ mod: "FVV", c: T.alarm, ic: "⚠️", title: `${pick(STREETS)} ko'chasi ${ri(1, 60)}-uy`, sub: "Gaz konsentratsiyasi yuqori — tekshiruv kerak" }),
  () => { const s = pick(STUDENTS); return { mod: "Ta'lim", c: T.amber, ic: "⏰", title: `${s.name} — ${s.grade}-${s.letter}`, sub: `Darsga kech qoldi (${ri(10, 45)} daqiqa)` }; },
];
function makeNotif() { const n = pick(NOTIF_KINDS)(); const d = new Date(); return { ...n, id: Math.random().toString(36).slice(2), t: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` }; }
function GridNotif() {
  const [list, setList] = useState(() => Array.from({ length: 8 }, makeNotif));
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setList((l) => [makeNotif(), ...l].slice(0, 14)), 3500);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <Section title="Bildirishnomalar" subtitle="Ta'lim · FVV · IIB — jonli ogohlantirishlar" badge="4">
      <div style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "auto", paddingRight: 2 }}>
        {list.map((n) => (
          <div key={n.id} style={{ display: "flex", gap: 10, padding: "9px 11px", borderRadius: 11, background: "rgba(255,255,255,.02)", border: `1px solid ${T.border}`, borderLeft: `3px solid ${n.c}`, animation: "tccFeedIn .4s" }}>
            <div style={{ fontSize: 17, lineHeight: 1 }}>{n.ic}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: n.c, textTransform: "uppercase", letterSpacing: ".5px", border: `1px solid ${n.c}55`, borderRadius: 5, padding: "1px 6px" }}>{n.mod}</span><span style={{ fontSize: 12.5, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</span></div>
              <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{n.sub}</div>
            </div>
            <div className="mono" style={{ fontSize: 11, color: T.muted, whiteSpace: "nowrap" }}>{n.t}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────── Bo'lim (grid) qobig'i ───────── */
function Section({ title, subtitle, badge, action, children }) {
  return (
    <section className="tcc-card" style={{ height: 470, display: "flex", flexDirection: "column" }}>
      <div className="hd" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><span style={{ width: 24, height: 24, borderRadius: 7, display: "grid", placeItems: "center", background: "rgba(45,212,191,.12)", color: T.teal, fontWeight: 700, fontSize: 12 }}>{badge}</span><div><div className="t">{title}</div><div className="s">{subtitle}</div></div></div>{action}</div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", marginTop: 6 }}>{children}</div>
    </section>
  );
}

const MarkazDashboardPage = () => {
  useInjectCC();
  return (
    <div className="tcc">
      <CcTop title="Mahalla boshqaruv markazi" subtitle="IIB · FVV · Ta'lim — yagona panel" />
      <div className="tcc-wrap">
        <div className="mkz-2x2">
          <GridUmumiy />
          <GridStatistika />
          <GridKameralar />
          <GridNotif />
        </div>
        <div style={{ marginTop: 16, fontSize: 11.5, color: T.muted }}>Barcha ko'rsatkichlar — <b>namunaviy (demo)</b>.</div>
      </div>
    </div>
  );
};
export default MarkazDashboardPage;
