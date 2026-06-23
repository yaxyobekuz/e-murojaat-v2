// Material Dashboard 2 uslubi (Tailwind'da takrorlangan) — gradient ikon-kartalar,
// rangli gradient grafik qutilar, oq kartalar, CRUD jadval. Funksional & interaktiv.
import { useMemo, useState } from "react";
import { Clock, Plus, Trash2, X } from "lucide-react";

import { EChart } from "@/shared/components/ui/chart3d/EChart";

// MD gradientlari (135deg main -> state)
export const MD = {
  primary: ["#EC407A", "#D81B60"],
  info: ["#49a3f1", "#1A73E8"],
  success: ["#66BB6A", "#43A047"],
  warning: ["#FFA726", "#FB8C00"],
  error: ["#EF5350", "#E53935"],
  dark: ["#42424a", "#191919"],
};
const grad = (c) => `linear-gradient(135deg, ${MD[c][0]}, ${MD[c][1]})`;
const shadow = (c) => `0 4px 20px 0 rgba(0,0,0,0.14), 0 7px 12px -5px ${MD[c][1]}80`;
const CARD = "rounded-2xl bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.12)]";
const TEXT = "#344767";

// ── Sahifa konteyneri (yorug' MD foni) ──
export const MdRoot = ({ children }) => (
  <div className="rounded-2xl bg-[#f0f2f5] p-4" style={{ color: TEXT }}>{children}</div>
);

// ── Navbar (breadcrumb + sarlavha + soat) ──
export const MdNavbar = ({ crumb, title }) => {
  const [t] = useState(() => new Date());
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  return (
    <div className="mb-4 flex items-center justify-between rounded-xl bg-white/70 px-4 py-2 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] backdrop-blur">
      <div className="leading-tight">
        <div className="text-[11px] text-slate-400">Boshqaruv / {crumb}</div>
        <div className="text-[15px] font-bold" style={{ color: TEXT }}>{title}</div>
      </div>
      <div className="flex items-center gap-1.5 text-[12px] text-slate-400"><Clock className="size-3.5" /> {hh}:{mm}</div>
    </div>
  );
};

// ── Tablar (MD pill uslubi) ──
export const MdTabs = ({ tabs, active, onChange, color = "info" }) => (
  <div className="mb-5 inline-flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.12)]">
    {tabs.map((t) => (
      <button key={t} onClick={() => onChange(t)}
        className="rounded-lg px-4 py-1.5 text-[13px] font-medium transition-colors"
        style={active === t ? { background: grad(color), color: "#fff" } : { color: "#7b809a" }}>
        {t}
      </button>
    ))}
  </div>
);

// ── Statistika kartasi (gradient ikon + raqam + foiz) ──
export const MdStatCard = ({ color = "info", icon: Icon, title, count, delta, deltaColor = "success", note }) => (
  <div className={`${CARD} relative px-4 pb-3 pt-1`}>
    <div className="flex items-start justify-between">
      <div className="-mt-6 grid size-16 place-items-center rounded-2xl text-white" style={{ background: grad(color), boxShadow: shadow(color) }}>
        {Icon && <Icon className="size-7" />}
      </div>
      <div className="pt-2 text-right">
        <div className="text-[13px] font-light text-slate-400">{title}</div>
        <div className="text-[22px] font-bold tabular-nums" style={{ color: TEXT }}>{count}</div>
      </div>
    </div>
    <hr className="my-2.5 border-slate-200/70" />
    <p className="px-0.5 text-[13px] text-slate-500">
      {delta && <span className="font-bold" style={{ color: MD[deltaColor][1] }}>{delta} </span>}
      {note}
    </p>
  </div>
);

// ── Grafik konfiguratsiyalari (oq seriya + rangli fon) ──
const baseAxis = {
  axisLine: { lineStyle: { color: "rgba(255,255,255,0.5)" } },
  axisTick: { show: false },
  axisLabel: { color: "rgba(255,255,255,0.9)", fontSize: 10 },
};
const barOption = (labels, values) => ({
  grid: { left: 10, right: 12, top: 16, bottom: 22, containLabel: true },
  tooltip: { trigger: "axis", backgroundColor: "#fff", borderWidth: 0, textStyle: { color: TEXT, fontSize: 11 } },
  xAxis: { type: "category", data: labels, ...baseAxis },
  yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,0.18)" } }, axisLabel: { color: "rgba(255,255,255,0.75)", fontSize: 9 } },
  series: [{ type: "bar", data: values, barWidth: "52%", itemStyle: { color: "rgba(255,255,255,0.9)", borderRadius: [3, 3, 0, 0] } }],
});
const lineOption = (labels, values) => ({
  grid: { left: 10, right: 12, top: 16, bottom: 22, containLabel: true },
  tooltip: { trigger: "axis", backgroundColor: "#fff", borderWidth: 0, textStyle: { color: TEXT, fontSize: 11 } },
  xAxis: { type: "category", boundaryGap: false, data: labels, ...baseAxis },
  yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,0.18)" } }, axisLabel: { color: "rgba(255,255,255,0.75)", fontSize: 9 } },
  series: [{ type: "line", smooth: true, data: values, symbol: "circle", symbolSize: 6, lineStyle: { color: "#fff", width: 2.5 }, itemStyle: { color: "#fff" }, areaStyle: { color: "rgba(255,255,255,0.14)" } }],
});

// ── Grafik kartasi (rangli gradient quti + matn) ──
export const MdChartCard = ({ color = "info", type = "bar", labels, values, title, description, date }) => {
  const option = useMemo(() => (type === "line" ? lineOption(labels, values) : barOption(labels, values)), [type, labels, values]);
  return (
    <div className={`${CARD} h-full p-2`}>
      <div className="-mt-7 overflow-hidden rounded-xl px-1 py-2" style={{ background: grad(color), boxShadow: shadow(color) }}>
        <EChart option={option} height={170} />
      </div>
      <div className="px-2 pb-1 pt-3">
        <h6 className="text-[15px] font-semibold capitalize" style={{ color: TEXT }}>{title}</h6>
        <p className="text-[12.5px] font-light text-slate-400">{description}</p>
        <hr className="my-2 border-slate-200/70" />
        <div className="flex items-center gap-1 text-[12px] font-light text-slate-400"><Clock className="size-3.5" /> {date}</div>
      </div>
    </div>
  );
};

const STATUS_TONE = {
  yashil: "bg-emerald-100 text-emerald-700", "qizil": "bg-rose-100 text-rose-700",
  sariq: "bg-amber-100 text-amber-700", kok: "bg-sky-100 text-sky-700", kulrang: "bg-slate-100 text-slate-600",
};

// ── CRUD jadval (qo'shish/o'chirish — boshqariladi) ──
export const MdTable = ({ title, color = "dark", columns, rows, setRows, subtitle }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => Object.fromEntries(columns.map((c) => [c.key, c.type === "select" ? c.options[0].value : ""])));

  const submit = () => {
    const id = `r${Date.now()}`;
    setRows([{ id, ...form }, ...rows]);
    setForm(Object.fromEntries(columns.map((c) => [c.key, c.type === "select" ? c.options[0].value : ""])));
    setOpen(false);
  };
  const del = (id) => setRows(rows.filter((r) => r.id !== id));

  return (
    <div className={`${CARD} overflow-hidden`}>
      <div className="m-2 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: grad(color), boxShadow: shadow(color) }}>
        <div className="leading-tight text-white">
          <div className="text-[15px] font-semibold">{title}</div>
          {subtitle && <div className="text-[12px] font-light text-white/70">{subtitle}</div>}
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/30">
          <Plus className="size-4" /> Qo'shish
        </button>
      </div>

      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-400">
              {columns.map((c) => <th key={c.key} className="px-3 py-2 font-semibold">{c.label}</th>)}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="px-3 py-6 text-center text-[13px] text-slate-400">Ma'lumot yo'q — "Qo'shish" tugmasini bosing</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 text-[13px] transition-colors hover:bg-slate-50" style={{ color: TEXT }}>
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2.5">
                    {c.type === "status" ? (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[c.tone?.(r[c.key]) || "kulrang"]}`}>{r[c.key]}</span>
                    ) : c.type === "number" ? (
                      <span className="font-mono tabular-nums">{r[c.key]}</span>
                    ) : (
                      r[c.key]
                    )}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-right">
                  <button onClick={() => del(r.id)} title="O'chirish" className="text-slate-400 transition-colors hover:text-rose-500"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ color: TEXT }}>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-[15px] font-bold">{title} — yangi yozuv</h4>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="size-4" /></button>
            </div>
            <div className="flex flex-col gap-3">
              {columns.map((c) => (
                <label key={c.key} className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-slate-500">{c.label}</span>
                  {c.type === "select" ? (
                    <select value={form[c.key]} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-sky-500">
                      {c.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input type={c.type === "number" ? "number" : "text"} value={form[c.key]} onChange={(e) => setForm({ ...form, [c.key]: c.type === "number" ? Number(e.target.value) : e.target.value })}
                      placeholder={c.label} className="rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-sky-500" />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-100">Bekor</button>
              <button onClick={submit} className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white" style={{ background: grad(color) }}>Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
