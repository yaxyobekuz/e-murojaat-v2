// Ta'lim — Analitika (command-center). Jonli Face-ID + maktab ma'lumotlari + Sankey/hex/grafiklar.
import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { T, useInjectCC, useCountUp, EPanel, CcTop, tip, lineOpt, barOpt } from "../cc";
import { M, fmt, dayLabel, trend30, classDist, INST, STUDENTS, FACES } from "../data";
import { InstitutionCard, StudentsBlock, StaffBlock } from "../sections";

const pad2 = (n) => String(n).padStart(2, "0");
const clockNow = () => { const d = new Date(); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`; };
const surname = (full) => full.split(" ")[0];

// ── Chap panel: jonli Face-ID skaner (o'quvchilar birin-ketin o'tadi) ──
function LiveFaceId({ onPass }) {
  const queue = useRef([]); const lastIdx = useRef(-1); const step = useRef(0);
  // Keyingi rasm: 3 rasm aralash, har bosqichda hammasi 1 martadan, ketma-ket takror yo'q
  const nextFace = () => {
    if (queue.current.length === 0) {
      const s = [0, 1, 2];
      for (let k = s.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [s[k], s[j]] = [s[j], s[k]]; }
      if (s[0] === lastIdx.current) [s[0], s[1]] = [s[1], s[0]];
      queue.current = s;
    }
    const idx = queue.current.shift(); lastIdx.current = idx;
    const f = FACES[idx];
    const pool = STUDENTS.filter((s) => s.gender === (f.female ? "qiz" : "o'g'il"));
    const st = pool[Math.floor(Math.random() * pool.length)];
    return { photo: f.photo, name: st.name, grade: st.grade, letter: st.letter, key: `f${step.current++}` };
  };
  const [cur, setCur] = useState(nextFace);
  const [phase, setPhase] = useState("scan"); // scan | ok
  const [feed, setFeed] = useState([]);
  const cb = useRef(onPass); cb.current = onPass;
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scanMs = reduce ? 600 : 1800, okMs = reduce ? 1100 : 2500;
    const t1 = setTimeout(() => setPhase("ok"), scanMs);
    const t2 = setTimeout(() => {
      setFeed((f) => [{ id: cur.key, name: cur.name, photo: cur.photo, grade: cur.grade, letter: cur.letter, t: clockNow() }, ...f].slice(0, 6));
      cb.current && cb.current();
      setPhase("scan");
      setCur(nextFace());
    }, okMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="tcc-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="hd"><div><div className="t">Face-ID — jonli kirish</div><div className="s">{M.name} · maktab darvozasi</div></div><span className="tcc-live"><i />JONLI</span></div>
      <div className="tcc-scan">
        <img src={cur.photo} alt="" />
        <div className="vig" />
        <div className="grid" />
        {phase === "scan" ? (
          <>
            <div className="line" />
            <span className="tag">● YUZ TEKSHIRILMOQDA</span>
            <span className="tcc-cn tl" /><span className="tcc-cn tr" /><span className="tcc-cn bl" /><span className="tcc-cn br" />
          </>
        ) : (
          <div className="ok"><b>✓</b></div>
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 21, color: T.text, lineHeight: 1.1 }}>{surname(cur.name)}</div>
        <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{cur.name.split(" ").slice(1).join(" ")} · {cur.grade}-{cur.letter} sinf</div>
        <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: phase === "ok" ? T.green : T.teal }}>
          {phase === "ok" ? "✓ Maktabga kirdi" : "Skaner ishlamoqda…"}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 10.5, color: T.muted, textTransform: "uppercase", letterSpacing: ".6px", fontWeight: 700 }}>So'nggi o'tganlar</div>
        {feed.length === 0 && <div style={{ fontSize: 12, color: T.muted, padding: "6px 2px" }}>Kutilmoqda…</div>}
        {feed.map((f) => (
          <div className="tcc-feedrow" key={f.id}>
            <img src={f.photo} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", objectPosition: "50% 18%", border: `1px solid ${T.border}`, background: "#0f1a24" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{surname(f.name)} <span style={{ color: T.muted, fontWeight: 400 }}>· {f.grade}-{f.letter}</span></div>
            </div>
            <div className="mono" style={{ fontSize: 11.5, color: T.green }}>{f.t}</div>
            <span style={{ color: T.green, fontSize: 13 }}>✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCHOOLS_INFO = [
  { n: "66-son maktab", p: 668, a: 94.2 },
  { n: "67-son maktab", p: 456, a: 95.1 },
  { n: "Bog'chalar (6 ta)", p: 312, a: 91.4 },
];

// ── O'ng panel: maktablar / umumiy ma'lumotlar ──
function SchoolInfoPanel({ enteredToday }) {
  const cov = +(((M.children6_18 - M.outOfSchool) / M.children6_18) * 100).toFixed(1);
  const kpis = [
    ["Jami o'quvchi", fmt(M.inSchool), T.text],
    ["Bugun kirdi", fmt(enteredToday), T.green],
    ["Umumiy qamrov", `${cov}%`, T.teal],
    ["Maktab / bog'cha", "2 / 6", T.gold],
  ];
  const att = [["Keldi", M.present, T.green], ["Sababli", M.excused, T.amber], ["Sababsiz", M.absent, T.alarm]];
  const attTotal = att.reduce((s, [, v]) => s + v, 0);
  return (
    <div className="tcc-card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="hd"><div><div className="t">Maktab ma'lumotlari</div><div className="s">{M.name} · {M.area}</div></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {kpis.map(([l, v, c]) => (
          <div key={l} style={{ border: `1px solid ${T.border}`, borderRadius: 12, padding: "11px 12px", background: "rgba(255,255,255,.02)" }}>
            <div style={{ fontSize: 10.5, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 700 }}>{l}</div>
            <div className="mono" style={{ fontSize: 23, fontWeight: 700, color: c, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: ".6px", fontWeight: 700, marginBottom: 8 }}>Muassasalar kesimi</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {SCHOOLS_INFO.map((s) => { const c = s.a >= 96 ? T.green : s.a >= 94 ? T.teal : T.amber; return (
            <div className="tcc-srow" key={s.n}>
              <div style={{ width: 36, height: 36, borderRadius: 9, display: "grid", placeItems: "center", background: "rgba(45,212,191,.1)", color: T.teal, fontWeight: 700, fontSize: 13 }}>🏫</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{s.n}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.muted, marginTop: 3, marginBottom: 5 }}><span>{fmt(s.p)} nafar</span><span style={{ color: c, fontWeight: 700 }}>davomat {s.a}%</span></div>
                <div className="tcc-bar"><i style={{ width: `${s.a}%`, background: c }} /></div>
              </div>
            </div>
          ); })}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: ".6px", fontWeight: 700, marginBottom: 8 }}>Bugungi davomat</div>
        <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", border: `1px solid ${T.border}` }}>
          {att.map(([l, v, c]) => <div key={l} title={`${l}: ${v}`} style={{ width: `${(v / attTotal) * 100}%`, background: c }} />)}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
          {att.map(([l, v, c]) => <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.muted }}><span style={{ width: 9, height: 9, borderRadius: 3, background: c }} />{l} <b style={{ color: T.text }}>{fmt(v)}</b></div>)}
        </div>
      </div>
      <div className="tcc-note"><span className="tcc-pill">namunaviy · Face-ID demo</span></div>
    </div>
  );
}

const HEX = [["Markaziy", 99, 0], ["Bog'", 98, 1], ["Maktab-66", 99, 0], ["Bozor", 88, 3], ["Sanoat", 79, 4], ["Yangi daha", 95, 1], ["Maktab-67", 99, 0], ["Chekka", 84, 3], ["Park", 97, 1], ["Stadion", 96, 1], ["Tibbiyot", 98, 0], ["Eski mahalla", 82, 3]].map(([name, cov, out]) => ({ name, cov, out }));
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
  const [entered, setEntered] = useState(1041);
  const out = useCountUp(M.outOfSchool); const cov = useCountUp(+(((M.children6_18 - M.outOfSchool) / M.children6_18) * 100).toFixed(1), 1500); const kids = useCountUp(M.children6_18, 1500); const chr = useCountUp(M.chronic);

  const radar = useMemo(() => { const rings = [["9-dan keyin", 97, T.gold], ["O'rta", 99, T.teal], ["Boshlang'ich", 99, T.green], ["Maktabgacha", 89.7, T.amber]]; return { backgroundColor: "transparent", series: rings.map((r, i) => ({ type: "gauge", startAngle: 90, endAngle: -270, radius: `${92 - i * 18}%`, center: ["50%", "52%"], pointer: { show: false }, progress: { show: true, roundCap: true, width: 8, itemStyle: { color: r[2] } }, axisLine: { lineStyle: { width: 8, color: [[1, "rgba(255,255,255,.06)"]] } }, splitLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, data: [{ value: r[1] }], detail: { show: false } })) }; }, []);
  const trend = useMemo(() => lineOpt(trend30(1).slice(30 - days), Array.from({ length: days }, (_, i) => dayLabel(days - 1 - i)), T.teal), [days]);
  const classes = useMemo(() => barOpt(Array.from({ length: 11 }, (_, i) => i + 1), classDist(1124, 1), T.teal), []);
  const girls = useMemo(() => ({ backgroundColor: "transparent", tooltip: { trigger: "item", ...tip }, series: [{ type: "pie", radius: ["56%", "78%"], center: ["50%", "48%"], label: { show: false }, data: [{ value: 552, name: "Qamrovda", itemStyle: { color: T.green } }, { value: 6, name: "Chetda qolgan qiz", itemStyle: { color: T.alarm } }] }] }), []);

  return (
    <div className="tcc">
      <CcTop subtitle={`${M.name} · ${M.area}`} right={<select className="tcc-sel" value={days} onChange={(e) => setDays(+e.target.value)} aria-label="Sana filtri"><option value={7}>7 kun</option><option value={14}>14 kun</option><option value={30}>30 kun</option></select>} />
      <div className="tcc-wrap">
        {/* ═══ 1) ASOSIY KPI — eng muhim raqamlar (tepada) ═══ */}
        <div className="tcc-hero">
          <div className="tcc-alarm"><div style={{ fontSize: 11, color: "#ffb3b3", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px" }}>⚠ Ta'limdan chetda qolgan bolalar</div><div className="big">{fmt(out)}</div><div style={{ fontSize: 11.5, color: T.muted, marginTop: 6 }}>6–18 yosh · ish 6 · kasallik 4 · noaniq 5 · ko'chgan 2</div></div>
          {[["Umumiy qamrov", `${cov.toFixed(1)}%`, T.green], ["Jami bola (6–18)", fmt(kids), T.text], ["Surunkali kelmaydigan", fmt(chr), T.amber]].map(([l, v, c], i) => <div className="tcc-kpi" key={i}><div className="lab">{l}</div><div className="val" style={{ color: c }}>{v}</div></div>)}
        </div>
        {/* ═══ 2) JONLI FACE-ID + MAKTAB MA'LUMOTLARI ═══ */}
        <div className="tcc-split">
          <LiveFaceId onPass={() => setEntered((v) => v + 1)} />
          <SchoolInfoPanel enteredToday={entered} />
        </div>
        {/* ═══ 3) ENG QIMMATLI GRAFIKLAR — davomat trendi + qamrov radari ═══ */}
        <div className="tcc-grid" style={{ marginBottom: 14 }}>
          <EPanel className="tcc-c8" delay={120} height={250} title="Davomat tendentsiyasi" subtitle={`Oxirgi ${days} kun`} option={trend} note={<span className="tcc-pill">namunaviy</span>} />
          <EPanel className="tcc-c4" delay={160} height={250} title="Qamrov radari" subtitle="Maktabgacha → 9-dan keyin" option={radar} note="Maktabgacha 89.7% · Boshlang'ich 99% · O'rta 99% · 9-dan keyin 97%" />
        </div>
        {/* ═══ 4) XAVF GURUHLARI + SINFLAR ═══ */}
        <div className="tcc-grid" style={{ marginBottom: 14 }}>
          <div className="tcc-card tcc-c6" style={{ animationDelay: "200ms" }}><div className="hd"><div><div className="t">Xavf guruhlari</div><div className="s">Maxsus e'tibor</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 2 }}>{[["Kam ta'minlangan oila", 38, T.amber], ["Yetim / vasiylik", 5, T.teal], ["Nogironligi bor", 8, T.gold]].map(([l, n, c]) => <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 10, background: "rgba(255,255,255,.02)" }}><div className="mono" style={{ fontSize: 22, fontWeight: 700, color: c, minWidth: 40 }}>{n}</div><div style={{ fontSize: 11.5 }}>{l}</div></div>)}</div>
            <div className="tcc-note"><span className="tcc-pill">namunaviy</span></div>
          </div>
          <EPanel className="tcc-c6" delay={240} height={230} title="Sinflar bo'yicha taqsimot" subtitle="1–11-sinf o'quvchilari" option={classes} note={<span className="tcc-pill">namunaviy</span>} />
        </div>
        {/* ═══ 5) KAMROQ KERAKLI — hex xarita + qizlar kesimi (pastda) ═══ */}
        <div className="tcc-grid">
          <div className="tcc-card tcc-c8" style={{ animationDelay: "300ms" }}><div className="hd"><div><div className="t">Tirik mahalla — qamrov</div><div className="s">Bloklar (hex)</div></div></div><div style={{ height: 260 }}><HexGrid /></div><div className="tcc-note"><span className="tcc-pill">namunaviy · qizil = past qamrov</span></div></div>
          <EPanel className="tcc-c4" delay={340} height={260} title="Qizlar bo'yicha kesim" subtitle="Erta nikoh xavfi monitoringi" option={girls} note={<span><span className="tcc-pill">namunaviy</span> &nbsp;Qizlar 558 · qamrov 98.9% · chetda 6</span>} />
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
