// Element tanlanganda — o'ng yarmida obyekt bo'yicha batafsil statistika.
// Tepada tizimlar/yo'nalishlar bo'yicha tablar; har tab o'sha yo'nalish bo'yicha muhim ma'lumotlarni ko'rsatadi.
import { useState } from "react";
import { X, Flame, Zap, Droplets, Wifi, Check, AlertTriangle, LayoutGrid, Coins, Users, Wheat, Route, Factory } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { elementInfo, fmt } from "../data/elementData";

const TONE = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/15 text-red-400 border-red-500/30",
};
const UTIL_ICON = { Gaz: Flame, Elektr: Zap, Suv: Droplets, Internet: Wifi };

function Facts({ facts }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {facts.map((f) => (
        <div key={f.label} className="rounded-lg border border-[rgb(var(--card-border))] bg-card/40 p-2">
          <p className="text-[9.5px] uppercase tracking-wide text-foreground/40">{f.label}</p>
          <p className="mt-0.5 text-[12px] font-semibold leading-tight">{f.value}</p>
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3">
      <p className="mb-2 text-[11px] font-semibold text-foreground/75">{title}</p>
      {children}
    </div>
  );
}

function MiniTrend({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-16 items-end gap-1.5">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t" style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.5 + (i / data.length) * 0.5 }} title={`${v} s/ga`} />
      ))}
    </div>
  );
}

// ===== Tab mazmunlari =====
function OverviewTab({ info }) {
  return <Facts facts={info.facts} />;
}

function KommunalTab({ info }) {
  const { consumption: cs } = info;
  return (
    <>
      <Section title="Kommunal ta'minot">
        <div className="grid grid-cols-4 gap-1.5">
          {info.utilities.map((u) => {
            const Icon = UTIL_ICON[u.name] || Check;
            return (
              <div key={u.name} className={cn("flex flex-col items-center gap-1 rounded-lg border p-2 text-[10px]", u.on ? "border-emerald-500/25 text-emerald-400" : "border-red-500/25 text-red-400/80")}>
                <Icon className="size-4" />
                {u.name}
                <span className="text-[8.5px] opacity-70">{u.on ? "ulangan" : "yo'q"}</span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Oylik sarfiyot (o'rtacha)">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-base font-semibold tabular-nums text-blue-400">{cs.gas}</p><p className="text-[9.5px] text-foreground/40">m³ gaz</p></div>
          <div><p className="text-base font-semibold tabular-nums text-amber-400">{cs.elec}</p><p className="text-[9.5px] text-foreground/40">kVt·s elektr</p></div>
          <div><p className="text-base font-semibold tabular-nums text-cyan-400">{cs.water}</p><p className="text-[9.5px] text-foreground/40">m³ suv</p></div>
        </div>
      </Section>
    </>
  );
}

function MoliyaTab({ info }) {
  const debts = info.debts || [];
  const taxes = info.taxes || [];
  return (
    <>
      {taxes.length > 0 && (
        <Section title="Soliqlar">
          <div className="flex flex-col gap-1.5">
            {taxes.map((t) => (
              <div key={t.name} className="flex items-center justify-between rounded-lg border border-[rgb(var(--card-border))] bg-card/40 px-2.5 py-1.5">
                <span className="flex items-center gap-1.5 text-[12px] text-foreground/80">
                  <span className={cn("size-1.5 rounded-full", t.paid ? "bg-emerald-400" : "bg-amber-400")} /> {t.name}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold tabular-nums">{fmt(t.amount)} so'm</span>
                  <span className={cn("rounded-md border px-1.5 py-px text-[9px] font-bold", t.paid ? TONE.success : TONE.warning)}>{t.paid ? "to'langan" : "kutilmoqda"}</span>
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Qarzdorlik holati">
        {debts.length === 0 ? (
          <p className="flex items-center gap-1.5 text-[12px] text-emerald-400"><Check className="size-4" /> Qarzdorlik mavjud emas</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {debts.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5">
                <span className="flex items-center gap-1.5 text-[12px] text-foreground/80"><AlertTriangle className="size-3.5 text-red-400" /> {d.name}</span>
                <span className="text-[12px] font-semibold tabular-nums text-red-400">{fmt(d.amount)} so'm</span>
              </div>
            ))}
            <div className="mt-0.5 flex items-center justify-between border-t border-[rgb(var(--card-border))] pt-1.5 text-[11px]">
              <span className="text-foreground/50">Jami qarz</span>
              <span className="font-semibold tabular-nums text-red-400">{fmt(debts.reduce((s, d) => s + d.amount, 0))} so'm</span>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

function StatBox({ value, label, color }) {
  return (
    <div className="rounded-lg border border-[rgb(var(--card-border))] bg-card/40 p-2 text-center">
      <p className="text-lg font-semibold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[9.5px] leading-tight text-foreground/40">{label}</p>
    </div>
  );
}

function IjtimoiyTab({ info }) {
  const s = info.social;
  const riskTone = s.risk === "Toza" ? "success" : s.risk === "Nazoratda" ? "warning" : "danger";
  return (
    <>
      <Section title="Aholi tarkibi">
        <div className="grid grid-cols-3 gap-2">
          <StatBox value={s.children} label="Bolalar (0-18)" color="#38bdf8" />
          <StatBox value={s.youth} label="Yoshlar" color="#f59e0b" />
          <StatBox value={s.pensioners} label="Nafaqaxo'rlar" color="#a78bfa" />
          <StatBox value={s.employed} label="Bandlar" color="#10b981" />
          <StatBox value={s.students} label="O'quvchi/talaba" color="#22d3ee" />
          <StatBox value={s.benefits ? "Ha" : "Yo'q"} label="Imtiyoz" color={s.benefits ? "#f59e0b" : "#64748b"} />
        </div>
      </Section>

      <Section title="Profilaktik holat">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-foreground/70">Yoshlar bilan ishlash</span>
          <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-bold", TONE[riskTone])}>{s.risk}</span>
        </div>
        {s.benefits && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5 text-[11px] text-amber-300">
            <Users className="size-3.5" /> Ijtimoiy himoya: {s.benefits}
          </div>
        )}
      </Section>
    </>
  );
}

function DalaTab({ info }) {
  return (
    <Section title="Hosildorlik dinamikasi (so'nggi 6 yil)">
      <MiniTrend data={info.yieldTrend} color="#10b981" />
      <p className="mt-1.5 text-[10px] text-foreground/40">O'rtacha hosildorlik, sentner/gektar</p>
    </Section>
  );
}

function YolTab({ info }) {
  const q = info.quality;
  const color = q > 75 ? "#10b981" : q > 50 ? "#f59e0b" : "#ef4444";
  return (
    <Section title="Yo'l qoplamasi holati">
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-foreground/60">Umumiy baho</span>
        <span className="font-semibold tabular-nums" style={{ color }}>{q}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
        <div className="asosiy-grow h-full rounded-full" style={{ width: `${q}%`, background: color }} />
      </div>
    </Section>
  );
}

function ZavodTab({ info }) {
  return (
    <Section title="Ish o'rinlari">
      <div className="flex items-end gap-2">
        <p className="text-3xl font-semibold tabular-nums text-purple-400">{info.workers}</p>
        <p className="pb-1 text-[11px] text-foreground/45">doimiy ish o'rni</p>
      </div>
    </Section>
  );
}

// Tur bo'yicha qaysi tablar ko'rinishi
function tabsForType(info) {
  const overview = { key: "overview", label: "Umumiy", icon: LayoutGrid, render: OverviewTab };
  switch (info.type) {
    case "uy":
      return [
        overview,
        { key: "kommunal", label: "Kommunal", icon: Droplets, render: KommunalTab },
        { key: "moliya", label: "Moliya", icon: Coins, render: MoliyaTab },
        { key: "ijtimoiy", label: "Ijtimoiy", icon: Users, render: IjtimoiyTab },
      ];
    case "dala":
      return [overview, { key: "hosil", label: "Hosil", icon: Wheat, render: DalaTab }];
    case "yol":
      return [overview, { key: "holat", label: "Holat", icon: Route, render: YolTab }];
    case "zavod":
      return [
        overview,
        { key: "ishlab", label: "Ishlab ch.", icon: Factory, render: ZavodTab },
        { key: "moliya", label: "Moliya", icon: Coins, render: MoliyaTab },
      ];
    default:
      return [overview];
  }
}

const DetailPanel = ({ element, onClose }) => {
  const info = elementInfo(element);
  const [active, setActive] = useState("overview");
  if (!info) return null;
  const meta = info.typeMeta;
  const tabs = tabsForType(info);
  const current = tabs.find((t) => t.key === active) || tabs[0];
  const Body = current.render;

  return (
    <div key={info.id} className="asosiy-slide flex h-full flex-col gap-3 overflow-hidden pr-1">
      {/* sarlavha */}
      <div className="flex items-start gap-2.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl text-[13px] font-bold" style={{ background: `${meta.color}22`, color: meta.color }}>
          {meta.label[0]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wide" style={{ background: `${meta.color}22`, color: meta.color }}>{meta.label}</span>
            <span className={cn("rounded-md border px-1.5 py-px text-[9.5px] font-bold", TONE[info.badgeTone])}>{info.badge}</span>
          </div>
          <h2 className="mt-1 truncate text-base font-semibold leading-tight tracking-tight">{info.title}</h2>
          <p className="truncate text-[11px] text-foreground/45">{info.subtitle}</p>
        </div>
        <button type="button" onClick={onClose} className="grid size-7 shrink-0 place-items-center rounded-lg border border-[rgb(var(--card-border))] text-foreground/55 transition-colors hover:text-foreground" title="Yopish">
          <X className="size-4" />
        </button>
      </div>

      {/* tablar — yo'nalishlar/tizimlar */}
      {tabs.length > 1 && (
        <div className="flex shrink-0 gap-1 rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const on = t.key === current.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[10.5px] font-medium transition-colors",
                  on ? "bg-foreground/10 text-foreground" : "text-foreground/45 hover:text-foreground/75",
                )}
              >
                <Icon className="size-3.5" /> {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* faol tab mazmuni — almashganda animatsiya */}
      <div key={current.key} className="asosiy-fade flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        <Body info={info} />
      </div>

      <p className="shrink-0 pt-1 text-center text-[10px] text-foreground/35">
        Obyekt ID: <span className="font-mono">{info.id}</span> · namunaviy ma'lumot
      </p>
    </div>
  );
};

export default DetailPanel;
