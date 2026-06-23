// Face-ID davomat tizimi — jonli (real API). Login bo'lmasa: ulanish formasi.
// Ulangach: dashboard KPI + hodimlar (bugungi holat) + bugungi eventlar (yuz rasmi bilan).
import { useEffect, useState } from "react";
import { T } from "./cc";
import { FID_BASE, fidToken, fidLogin, fidLogout, fidEmployees, fidEventsToday, fidDashboard, asArray, faceSrc } from "./faceid";

const F = (e, keys) => { for (const k of keys) if (e && e[k] != null && e[k] !== "") return e[k]; return null; };
const empName = (e) => F(e, ["name", "fullName", "employeeName"]) || `${F(e, ["firstName"]) || ""} ${F(e, ["lastName"]) || ""}`.trim() || "—";
const fmtTime = (t) => { if (!t) return "—"; const s = String(t); const m = s.match(/(\d{2}:\d{2})/); return m ? m[1] : s.slice(0, 16).replace("T", " "); };

export default function FaceIdPanel() {
  const [tok, setTok] = useState(fidToken());
  const [cred, setCred] = useState({ username: "", password: "" });
  const [st, setSt] = useState({ loading: false, error: "", dash: null, emps: [], events: [] });

  const load = async () => {
    setSt((s) => ({ ...s, loading: true, error: "" }));
    try {
      const [dash, emps, events] = await Promise.all([fidDashboard().catch(() => null), fidEmployees().catch(() => []), fidEventsToday().catch(() => [])]);
      setSt({ loading: false, error: "", dash, emps: asArray(emps), events: asArray(events) });
    } catch (e) { setSt((s) => ({ ...s, loading: false, error: e.message })); }
  };
  useEffect(() => { if (tok) load(); /* eslint-disable-next-line */ }, [tok]);

  const login = async (e) => {
    e && e.preventDefault();
    setSt((s) => ({ ...s, error: "" }));
    try { await fidLogin(cred.username.trim(), cred.password); setTok(fidToken()); }
    catch (err) { setSt((s) => ({ ...s, error: err.message })); }
  };
  const logout = () => { fidLogout(); setTok(null); setSt({ loading: false, error: "", dash: null, emps: [], events: [] }); };

  /* ── Ulanmagan: login ── */
  if (!tok) return (
    <div className="tcc-card tcc-c12">
      <div className="hd"><div><div className="t">Face-ID davomat tizimi — ulanish</div><div className="s">Real terminal ma'lumotlari · {FID_BASE}</div></div><span className="tcc-pill real">jonli</span></div>
      <form onSubmit={login} style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", maxWidth: 520 }}>
        <input className="tcc-inp" placeholder="Login" value={cred.username} onChange={(e) => setCred({ ...cred, username: e.target.value })} autoComplete="username" />
        <input className="tcc-inp" type="password" placeholder="Parol" value={cred.password} onChange={(e) => setCred({ ...cred, password: e.target.value })} autoComplete="current-password" />
        <button className="tcc-btn" type="submit" style={{ borderColor: T.gold, color: T.gold }}>Ulanish →</button>
      </form>
      {st.error && <div style={{ marginTop: 8, color: T.red, fontSize: 12 }}>{st.error}</div>}
      <div style={{ marginTop: 10, fontSize: 11, color: T.muted }}>Login/parol kiritilgach real Face-ID ma'lumotlari (hodimlar, keldi-ketdi, yuz rasmlari) yuklanadi.</div>
    </div>
  );

  /* ── Ulangan: jonli ma'lumot ── */
  const dashTiles = st.dash && typeof st.dash === "object" ? Object.entries(st.dash).filter(([, v]) => typeof v === "number").slice(0, 6) : [];
  return (
    <div className="tcc-card tcc-c12">
      <div className="hd"><div><div className="t">Face-ID davomat tizimi — jonli</div><div className="s">{FID_BASE} · ulandi</div></div>
        <div style={{ display: "flex", gap: 8 }}><button className="tcc-btn" onClick={load} disabled={st.loading}>{st.loading ? "Yuklanmoqda…" : "↻ Yangilash"}</button><button className="tcc-btn" onClick={logout}>Chiqish</button></div>
      </div>
      {st.error && <div style={{ color: T.red, fontSize: 12, marginBottom: 8 }}>{st.error}</div>}

      {dashTiles.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(6, dashTiles.length)},1fr)`, gap: 10, marginBottom: 14 }}>
          {dashTiles.map(([k, v]) => <div key={k} style={{ border: `1px solid ${T.border}`, borderRadius: 11, padding: "10px 12px", background: "rgba(255,255,255,.02)" }}><div className="mono" style={{ fontSize: 22, fontWeight: 700, color: T.teal }}>{v}</div><div style={{ fontSize: 10.5, color: T.muted }}>{k}</div></div>)}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        {/* Hodimlar */}
        <div>
          <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>Hodimlar · {st.emps.length}</div>
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            <table className="tcc-tbl"><thead><tr><th>F.I.O</th><th>Tabel</th><th>Holat</th><th>Vaqt</th></tr></thead>
              <tbody>{st.emps.slice(0, 100).map((e, i) => { const status = F(e, ["status", "todayStatus", "state"]); return (
                <tr key={i}><td style={{ fontWeight: 600 }}>{empName(e)}</td><td className="mono">{F(e, ["employeeNo", "id", "employeeId"]) ?? "—"}</td>
                  <td><span className="tcc-badge" style={status && /kel|in|present|keldi/i.test(String(status)) ? { background: "rgba(47,191,135,.16)", color: T.green } : { background: "rgba(124,139,153,.16)", color: T.muted }}>{status ?? "—"}</span></td>
                  <td className="mono">{fmtTime(F(e, ["lastSeen", "time", "checkIn", "inTime", "lastTime"]))}</td>
                </tr>); })}
                {st.emps.length === 0 && <tr><td colSpan={4} style={{ color: T.muted, padding: 16, textAlign: "center" }}>Hodim yo'q yoki ruxsat yetarli emas</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        {/* Eventlar — yuz rasmi */}
        <div>
          <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>Bugungi Face-ID · {st.events.length}</div>
          <div style={{ maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            {st.events.slice(0, 60).map((e, i) => { const img = faceSrc(F(e, ["imageBase64", "image", "faceImage", "photo"])); const io = F(e, ["inOut", "direction"]); return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${T.border}`, borderRadius: 10, padding: 8, background: "rgba(255,255,255,.02)" }}>
                {img ? <img src={img} alt="" className="tcc-face" /> : <span className="tcc-face" style={{ display: "grid", placeItems: "center", color: T.muted, fontSize: 9 }}>yuz</span>}
                <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontWeight: 600, fontSize: 12.5 }}>{empName(e)}</div><div style={{ fontSize: 10.5, color: T.muted }}>{F(e, ["verifyMode"]) || "face"} · {fmtTime(F(e, ["time", "timestamp", "createdAt"]))}</div></div>
                {io && <span className="tcc-badge" style={/out|ket/i.test(String(io)) ? { background: "rgba(217,154,43,.18)", color: T.amber } : { background: "rgba(47,191,135,.16)", color: T.green }}>{io}</span>}
              </div>); })}
            {st.events.length === 0 && <div style={{ color: T.muted, padding: 16, textAlign: "center" }}>Bugun event yo'q</div>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}><span className="tcc-pill real">real · Face-ID API</span></div>
    </div>
  );
}
