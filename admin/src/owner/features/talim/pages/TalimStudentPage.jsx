// Ta'lim — O'quvchi sahifasi. Kunlik davomat (kelgan/ketgan vaqt), Face-ID rasmlari,
// dars o'tirgan vaqti, kech qolgan kunlar, sinf, sinf rahbari.
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { T, useInjectCC, CcTop, MiniChart, tip } from "../cc";
import { getStudent, studentLog, classTeacher, fmt } from "../data";

const STBADGE = (st) => st === "kelgan" ? { background: "rgba(47,191,135,.16)", color: T.green, label: "Keldi" } : st === "kech" ? { background: "rgba(217,154,43,.18)", color: T.amber, label: "Kech qoldi" } : { background: "rgba(229,72,77,.16)", color: T.red, label: "Kelmadi" };

const TalimStudentPage = () => {
  useInjectCC();
  const nav = useNavigate();
  const { id } = useParams();
  const st = getStudent(id);
  const log = useMemo(() => (st ? studentLog(st, 20) : []), [id]);

  if (!st) return (
    <div className="tcc"><CcTop title="O'quvchi topilmadi" right={<button className="tcc-btn" onClick={() => nav("/owner/talim/malumotlar")}>← Orqaga</button>} /><div className="tcc-wrap"><div className="tcc-card" style={{ padding: 30 }}>Bunday o'quvchi yo'q.</div></div></div>
  );

  const present = log.filter((d) => d.status !== "kelmagan").length;
  const late = log.filter((d) => d.status === "kech").length;
  const absent = log.filter((d) => d.status === "kelmagan").length;
  const lateTotal = log.reduce((a, d) => a + d.lateMin, 0);
  const avgH = (log.filter((d) => d.hours > 0).reduce((a, d) => a + d.hours, 0) / Math.max(1, present)).toFixed(1);
  const kpis = [["Oylik davomat", `${st.att}%`, st.att >= 92 ? T.green : T.amber], ["Kelgan kun", `${present}/${log.length}`, T.green], ["Kech qolgan", `${late} kun`, T.amber], ["Qoldirgan", `${absent} kun`, T.red], ["O'rtacha dars", `${avgH} soat`, T.teal]];

  const hoursChart = useMemo(() => ({ backgroundColor: "transparent", grid: { left: 8, right: 12, top: 16, bottom: 22, containLabel: true }, tooltip: { trigger: "axis", ...tip }, xAxis: { type: "category", data: log.map((d) => d.date), axisLabel: { color: T.muted, fontSize: 9 }, axisLine: { lineStyle: { color: "rgba(255,255,255,.14)" } } }, yAxis: { type: "value", max: 8, axisLabel: { color: T.muted, fontSize: 9, formatter: "{value}h" }, splitLine: { lineStyle: { color: "rgba(255,255,255,.05)" } } }, series: [{ type: "bar", data: log.map((d) => ({ value: d.hours, itemStyle: { color: d.status === "kelgan" ? T.green : d.status === "kech" ? T.amber : T.red, borderRadius: [3, 3, 0, 0] } })), barWidth: "55%" }] }), [id]);

  return (
    <div className="tcc">
      <CcTop title={st.name} subtitle={`${st.grade}-${st.letter} sinf · ${st.inst}`} right={<button className="tcc-btn" onClick={() => nav("/owner/talim/malumotlar")}>← O'quvchilar</button>} />
      <div className="tcc-wrap">
        {/* Profil + KPI */}
        <div className="tcc-grid" style={{ marginBottom: 14 }}>
          <div className="tcc-card tcc-c4" style={{ flexDirection: "row", gap: 14, alignItems: "center", animationDelay: "60ms" }}>
            <img src={st.photo} alt={st.name} style={{ width: 92, height: 92, borderRadius: 14, objectFit: "cover", border: `1px solid ${T.border}` }} />
            <div>
              <div style={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: 18 }}>{st.name}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{st.grade}-{st.letter} sinf · {st.age} yosh · {st.gender}</div>
              <div style={{ fontSize: 12, marginTop: 8 }}><span style={{ color: T.muted }}>Sinf rahbari:</span> <b>{classTeacher(st.grade)}</b></div>
              <div style={{ fontSize: 12, marginTop: 3 }}><span style={{ color: T.muted }}>Muassasa:</span> {st.inst}</div>
              <div style={{ marginTop: 8 }}><span className="tcc-badge" style={st.status === "doimiy" ? { background: "rgba(47,191,135,.16)", color: T.green } : { background: "rgba(229,72,77,.16)", color: T.red }}>{st.status === "doimiy" ? "Doimiy keluvchi" : "Dars qoldiruvchi"}</span></div>
            </div>
          </div>
          <div className="tcc-card tcc-c8" style={{ animationDelay: "120ms" }}>
            <div className="hd"><div><div className="t">Davomat ko'rsatkichlari</div><div className="s">Oxirgi {log.length} kun · jami kechikish {lateTotal} daq</div></div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>{kpis.map(([l, v, c]) => <div key={l} style={{ border: `1px solid ${T.border}`, borderRadius: 11, padding: "12px 12px", background: "rgba(255,255,255,.02)" }}><div className="mono" style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div><div style={{ fontSize: 10.5, color: T.muted, marginTop: 2 }}>{l}</div></div>)}</div>
          </div>
        </div>

        {/* Dars vaqti grafigi */}
        <div className="tcc-grid" style={{ marginBottom: 14 }}>
          <div className="tcc-card tcc-c12" style={{ animationDelay: "180ms" }}><div className="hd"><div><div className="t">Kunlik dars o'tirgan vaqti</div><div className="s">Soat · rang: keldi/kech/kelmadi</div></div></div><div style={{ height: 200 }}><MiniChart height={200} option={hoursChart} /></div></div>
        </div>

        {/* Davomat jurnali + Face-ID */}
        <div className="tcc-grid">
          <div className="tcc-card tcc-c12" style={{ animationDelay: "220ms" }}>
            <div className="hd"><div><div className="t">Davomat jurnali — Face-ID</div><div className="s">Har kirish Face-ID orqali qayd etiladi</div></div><span className="tcc-pill">namunaviy</span></div>
            <div style={{ maxHeight: 460, overflowY: "auto" }}>
              <table className="tcc-tbl"><thead><tr><th>Face-ID</th><th>Sana</th><th>Kun</th><th>Kelgan</th><th>Ketgan</th><th>Dars (soat)</th><th>Kechikish</th><th>Holat</th></tr></thead>
                <tbody>{log.slice().reverse().map((d, i) => { const b = STBADGE(d.status); return (
                  <tr key={i}>
                    <td>{d.status !== "kelmagan" ? <span style={{ position: "relative", display: "inline-block" }}><img src={d.face} alt="" className="tcc-face" loading="lazy" /><span style={{ position: "absolute", bottom: 1, left: 1, fontSize: 7, background: "rgba(0,0,0,.7)", color: T.green, padding: "0 2px", borderRadius: 2, fontFamily: "monospace" }}>{d.faceTime}</span></span> : <span style={{ width: 46, height: 46, borderRadius: 8, border: `1px dashed ${T.border}`, display: "inline-grid", placeItems: "center", color: T.muted, fontSize: 9 }}>yo'q</span>}</td>
                    <td className="mono">{d.date}</td><td style={{ color: T.muted }}>{d.dow}</td>
                    <td className="mono" style={{ color: d.status === "kech" ? T.amber : T.text }}>{d.in}</td>
                    <td className="mono">{d.out}</td>
                    <td className="mono">{d.hours > 0 ? d.hours : "—"}</td>
                    <td className="mono" style={{ color: d.lateMin ? T.amber : T.muted }}>{d.lateMin ? `${d.lateMin} daq` : "—"}</td>
                    <td><span className="tcc-badge" style={{ background: b.background, color: b.color }}>{b.label}</span></td>
                  </tr>); })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 11.5, color: T.muted }}>Barcha ma'lumotlar — <b>namunaviy</b>. Face-ID rasmlari demo uchun.</div>
      </div>
    </div>
  );
};
export default TalimStudentPage;
