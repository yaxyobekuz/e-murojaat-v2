// Ta'lim — Analitika (command-center). Sankey + hex + grafiklar. (Umumiy ma'lumotlar alohida sahifa.)
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T, useInjectCC, useCountUp, EPanel, CcTop, tip, lineOpt, barOpt } from "../cc";
import { M, fmt, dayLabel, trend30, classDist, INST } from "../data";
import { InstitutionCard, StudentsBlock, StaffBlock } from "../sections";

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

const TalimDashboardPage = () => {
  useInjectCC();
  const nav = useNavigate();
  const [days, setDays] = useState(14);
  const out = useCountUp(M.outOfSchool); const cov = useCountUp(+(((M.children6_18 - M.outOfSchool) / M.children6_18) * 100).toFixed(1), 1500); const kids = useCountUp(M.children6_18, 1500); const chr = useCountUp(M.chronic);

  const sankey = useMemo(() => { const red = { itemStyle: { color: T.alarm }, label: { color: T.alarm } }; return { backgroundColor: "transparent", tooltip: { trigger: "item", ...tip }, series: [{ type: "sankey", left: 6, right: 130, top: 12, bottom: 12, nodeWidth: 13, nodeGap: 13, emphasis: { focus: "adjacency" }, draggable: false, label: { color: T.text, fontSize: 11 }, lineStyle: { color: "gradient", curveness: .5, opacity: .42 }, data: [{ name: "Bolalar 6–18", itemStyle: { color: T.gold } }, { name: "Maktabda o'qiyapti", itemStyle: { color: T.green } }, { name: "Maktabgacha tayyorlov", itemStyle: { color: T.teal } }, { name: "⚠ Chetda qolgan", ...red }, { name: "9-sinfni tugatdi", itemStyle: { color: T.gold } }, { name: "10-sinf (akademik)", itemStyle: { color: T.green } }, { name: "Kollej / texnikum", itemStyle: { color: T.teal } }, { name: "⚠ Hech qayerda", ...red }], links: [{ source: "Bolalar 6–18", target: "Maktabda o'qiyapti", value: 2540 }, { source: "Bolalar 6–18", target: "Maktabgacha tayyorlov", value: 109 }, { source: "Bolalar 6–18", target: "⚠ Chetda qolgan", value: 31, lineStyle: { color: T.alarm, opacity: .65 } }, { source: "Maktabda o'qiyapti", target: "9-sinfni tugatdi", value: 224 }, { source: "9-sinfni tugatdi", target: "10-sinf (akademik)", value: 150 }, { source: "9-sinfni tugatdi", target: "Kollej / texnikum", value: 65 }, { source: "9-sinfni tugatdi", target: "⚠ Hech qayerda", value: 9, lineStyle: { color: T.alarm, opacity: .65 } }] }] }; }, []);
  const radar = useMemo(() => { const rings = [["9-dan keyin", 96, T.gold], ["O'rta", 97, T.teal], ["Boshlang'ich", 99, T.green], ["Maktabgacha", 78, T.amber]]; return { backgroundColor: "transparent", series: rings.map((r, i) => ({ type: "gauge", startAngle: 90, endAngle: -270, radius: `${92 - i * 18}%`, center: ["50%", "52%"], pointer: { show: false }, progress: { show: true, roundCap: true, width: 8, itemStyle: { color: r[2] } }, axisLine: { lineStyle: { width: 8, color: [[1, "rgba(255,255,255,.06)"]] } }, splitLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, data: [{ value: r[1] }], detail: { show: false } })) }; }, []);
  const trend = useMemo(() => lineOpt(trend30(1).slice(30 - days), Array.from({ length: days }, (_, i) => dayLabel(days - 1 - i)), T.teal), [days]);
  const classes = useMemo(() => barOpt(Array.from({ length: 11 }, (_, i) => i + 1), classDist(2860, 1), T.teal), []);
  const girls = useMemo(() => ({ backgroundColor: "transparent", tooltip: { trigger: "item", ...tip }, series: [{ type: "pie", radius: ["56%", "78%"], center: ["50%", "48%"], label: { show: false }, data: [{ value: 1231, name: "Qamrovda", itemStyle: { color: T.green } }, { value: 14, name: "Chetda qolgan qiz", itemStyle: { color: T.alarm } }] }] }), []);

  return (
    <div className="tcc">
      <CcTop subtitle={`${M.name} · ${M.area}`} right={<select className="tcc-sel" value={days} onChange={(e) => setDays(+e.target.value)} aria-label="Sana filtri"><option value={7}>7 kun</option><option value={14}>14 kun</option><option value={30}>30 kun</option></select>} />
      <div className="tcc-wrap">
        <div className="tcc-hero">
          <div className="tcc-alarm"><div style={{ fontSize: 11, color: "#ffb3b3", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px" }}>⚠ Ta'limdan chetda qolgan bolalar</div><div className="big">{fmt(out)}</div><div style={{ fontSize: 11.5, color: T.muted, marginTop: 6 }}>6–18 yosh · ish 12 · kasallik 7 · noaniq 9 · ko'chgan 3</div></div>
          {[["Umumiy qamrov", `${cov.toFixed(1)}%`, T.green], ["Jami bola (6–18)", fmt(kids), T.text], ["Surunkali kelmaydigan", fmt(chr), T.amber]].map(([l, v, c], i) => <div className="tcc-kpi" key={i}><div className="lab">{l}</div><div className="val" style={{ color: c }}>{v}</div></div>)}
        </div>
        <div className="tcc-grid" style={{ marginBottom: 14 }}>
          <EPanel className="tcc-c8" delay={120} height={360} title="Bola qayoqqa ketadi — oqim" subtitle="6–18 yosh · maktab → 9-sinfdan keyin" option={sankey} note={<span><span className="tcc-pill">namunaviy</span> &nbsp;Qizil tarmoqlar — chetda qolgan / hech qayerda</span>} />
          <div className="tcc-card tcc-c4" style={{ animationDelay: "220ms" }}><div className="hd"><div><div className="t">Tirik mahalla — qamrov</div><div className="s">Bloklar (hex)</div></div></div><HexGrid /><div className="tcc-note"><span className="tcc-pill">namunaviy · qizil = past qamrov</span></div></div>
        </div>
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
        {/* ═══ UMUMIY MA'LUMOTLAR (analitikada ham turaversin; bo'lim bosilsa to'liq sahifaga) ═══ */}
        <div className="tcc-h2" role="button" tabIndex={0} style={{ cursor: "pointer", marginTop: 26 }} onClick={() => nav("/owner/talim/malumotlar")} onKeyDown={(e) => e.key === "Enter" && nav("/owner/talim/malumotlar")}>
          Umumiy ma'lumotlar <span style={{ fontSize: 12, color: T.gold, fontWeight: 600 }}>— to'liq sahifa →</span>
        </div>
        <div className="tcc-inst" style={{ marginBottom: 14 }}>{INST.map((it, i) => <InstitutionCard key={it.id} inst={it} delay={i * 80} onOpen={() => nav("/owner/talim/malumotlar")} />)}</div>
        <div className="tcc-grid" style={{ marginBottom: 14 }}><StudentsBlock subtitle="Qatorni bosing — o'quvchi sahifasi ochiladi · to'liq ro'yxat alohida sahifada" maxRows={14} /></div>
        <div className="tcc-grid"><StaffBlock /></div>

        <div style={{ marginTop: 16, fontSize: 11.5, color: T.muted }}>Barcha ko'rsatkichlar — <b>namunaviy</b>.</div>
      </div>
    </div>
  );
};
export default TalimDashboardPage;
