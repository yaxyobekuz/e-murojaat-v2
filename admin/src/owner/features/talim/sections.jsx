// Ta'lim — "Umumiy ma'lumotlar" qayta ishlatiladigan bo'limlari (analitika + alohida sahifada).
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { T, useTween, MiniChart, donutOpt, lineOpt, barOpt } from "./cc";
import { fmt, dayLabel, STUDENTS, STAFF, SUBJECTS, SCHOOLS3 } from "./data";

export function InstitutionModal({ inst, onClose }) {
  const labels = inst.kind === "kg" ? inst.groups.map((g) => g[0]) : Array.from({ length: 11 }, (_, i) => `${i + 1}`);
  const distData = inst.kind === "kg" ? inst.groups.map((g) => g[1]) : inst.dist;
  const kpis = [["Jami", fmt(inst.students)], ["O'g'il bola", fmt(inst.boys)], ["Qiz bola", fmt(inst.girls)], ["O'rtacha davomat", `${inst.attendance}%`], ["Surunkali", fmt(inst.chronic)]];
  return createPortal(
    <div className="tcc-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="tcc-mbox" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}><div><div style={{ fontFamily: '"Space Grotesk",Inter', fontWeight: 700, fontSize: 18, color: inst.accent }}>{inst.title}</div><div style={{ fontSize: 12, color: T.muted }}>{inst.sub} · {inst.schools.join(" · ")}</div></div><button className="tcc-x" onClick={onClose}>×</button></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 14 }}>{kpis.map(([l, v]) => <div key={l} style={{ border: `1px solid ${T.border}`, borderRadius: 11, padding: "10px 12px", background: "rgba(255,255,255,.02)" }}><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: inst.accent }}>{v}</div><div style={{ fontSize: 10.5, color: T.muted }}>{l}</div></div>)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14 }}>
          <div><div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Jins bo'yicha</div><MiniChart height={220} option={donutOpt(inst.boys, inst.girls)} /></div>
          <div><div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Oylik o'rtacha davomat — 30 kun</div><MiniChart height={220} option={lineOpt(inst.trend, inst.trend.map((_, i) => dayLabel(29 - i)), inst.accent)} /></div>
        </div>
        <div style={{ marginTop: 14 }}><div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{inst.kind === "kg" ? "Bog'cha turi bo'yicha" : "Sinflar bo'yicha taqsimot"}</div><MiniChart height={200} option={barOpt(labels, distData, inst.accent)} /></div>
        <div style={{ marginTop: 12 }}><span className="tcc-pill">namunaviy</span></div>
      </div>
    </div>, document.body);
}

export function InstitutionCard({ inst, delay, onOpen }) {
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

const BADGE = (st) => st === "doimiy" ? { background: "rgba(47,191,135,.16)", color: T.green } : { background: "rgba(229,72,77,.16)", color: T.red };
export function StudentsBlock({ subtitle = "Qatorni bosing — o'quvchi sahifasi (davomat, Face-ID) ochiladi", maxRows }) {
  const nav = useNavigate();
  const [f, setF] = useState({ grade: "all", status: "all", gender: "all", inst: "all", q: "", aMin: 6, aMax: 18 });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const list = useMemo(() => STUDENTS.filter((s) => (f.grade === "all" || s.grade === +f.grade) && (f.status === "all" || s.status === f.status) && (f.gender === "all" || s.gender === f.gender) && (f.inst === "all" || s.inst === f.inst) && s.age >= f.aMin && s.age <= f.aMax && (!f.q || s.name.toLowerCase().includes(f.q.toLowerCase()))), [f]);
  const found = useTween(list.length);
  return (
    <div className="tcc-card tcc-c12" style={{ animationDelay: "120ms" }}>
      <div className="hd"><div><div className="t">O'quvchilar ro'yxati</div><div className="s">{subtitle}</div></div><span className="tcc-found">topildi: {fmt(found)}</span></div>
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
      <div style={{ maxHeight: maxRows ? 360 : 460, overflowY: "auto" }}>
        <table className="tcc-tbl"><thead><tr><th>Ism</th><th>Sinf</th><th>Yosh</th><th>Jins</th><th>Muassasa</th><th>Davomat</th><th>Holat</th></tr></thead>
          <tbody>{(maxRows ? list.slice(0, maxRows) : list).map((s) => (
            <tr key={s.id} className="tcc-srow" onClick={() => nav(`/owner/talim/oquvchi/${s.id}`)}>
              <td style={{ fontWeight: 600 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><img src={s.photo} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover" }} loading="lazy" />{s.name}</span></td>
              <td className="mono">{s.grade}-{s.letter}</td><td className="mono">{s.age}</td><td style={{ color: T.muted }}>{s.gender}</td><td style={{ color: T.muted }}>{s.inst}</td>
              <td className="mono" style={{ color: s.att >= 92 ? T.green : s.att >= 88 ? T.amber : T.red, fontWeight: 700 }}>{s.att}%</td>
              <td><span className="tcc-badge" style={BADGE(s.status)}>{s.status}</span></td>
            </tr>))}
            {list.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: T.muted, padding: 24 }}>O'quvchi topilmadi</td></tr>}
          </tbody>
        </table>
      </div>
      {maxRows && list.length > maxRows && <div style={{ marginTop: 6, fontSize: 11.5, color: T.muted }}>… yana {fmt(list.length - maxRows)} o'quvchi · to'liq ro'yxat “Umumiy ma'lumotlar” sahifasida</div>}
      <div style={{ marginTop: 8 }}><span className="tcc-pill">namunaviy ro'yxat</span></div>
    </div>
  );
}

export function StaffBlock() {
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
