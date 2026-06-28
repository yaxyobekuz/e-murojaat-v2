// Element tanlanganda — o'ng yarmida obyekt bo'yicha batafsil statistika.
// Tepada tizimlar/yo'nalishlar bo'yicha tablar; har tab o'sha yo'nalish bo'yicha muhim ma'lumotlarni ko'rsatadi.
import { useState } from "react";
import { X, Flame, Zap, Droplets, Wifi, Check, AlertTriangle, LayoutGrid, Coins, Users, Wheat, Route, Factory, Building2, User, Layers, Ruler, ArrowUpNarrowWide, Wallet, MapPin, Phone, BadgeCheck, MessageSquare, Clock, Inbox, Stethoscope, Cylinder, Briefcase, UserX, HeartHandshake, ShieldCheck, Sun, Trash2, Truck, Gauge, WifiOff, Lightbulb, ShieldAlert, FlameKindling, Activity, Sprout, Egg } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { elementInfo, fmt, STATUS_TONES } from "../data/elementData";

const TONE = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/15 text-red-400 border-red-500/30",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/30",
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

// rasmga mos qatorli reyestr ko'rinishi (ikona · yorliq · qiymat)
const FACT_ICON = {
  Turi: Building2,
  Egasi: User,
  Mulkchilik: Layers,
  Maydon: Ruler,
  Qavatlar: Layers,
  Balandlik: ArrowUpNarrowWide,
  Qiymati: Wallet,
  Manzil: MapPin,
};

function FactRows({ facts }) {
  return (
    <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40">
      {facts.map((f, i) => {
        const Icon = FACT_ICON[f.label] || Check;
        return (
          <div
            key={f.label}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2",
              i > 0 && "border-t border-[rgb(var(--card-border))]",
            )}
          >
            <Icon className="size-3.5 shrink-0 text-foreground/40" />
            <span className="text-[11px] text-foreground/50">{f.label}</span>
            <span className="ml-auto text-right text-[12px] font-semibold tabular-nums">{f.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// to'lov darajasi: 0-100 → qizil/sariq/yashil
function payTone(rate) {
  if (rate >= 80) return { color: "#10b981", label: "Yaxshi holatda", tone: "success" };
  if (rate >= 40) return { color: "#f59e0b", label: "Qisman to'langan", tone: "warning" };
  return { color: "#ef4444", label: "Katta qarzdorlik", tone: "danger" };
}

function TaxStatus({ tax }) {
  const { color, label } = payTone(tax.payRate);
  const rows = [
    { name: "Yillik soliq summasi", amount: tax.annual, danger: false },
    { name: "Soliq qarzdorligi", amount: tax.taxDebt, danger: tax.taxDebt > 0 },
    { name: "MIB qarzdorligi", amount: tax.mibDebt, danger: tax.mibDebt > 0 },
  ];
  return (
    <Section title="Soliq holati">
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between text-[12px]">
            <span className="text-foreground/65">{r.name}</span>
            <span className={cn("font-semibold tabular-nums", r.danger ? "text-red-400" : "text-foreground/90")}>
              {fmt(r.amount)} so'm
            </span>
          </div>
        ))}
      </div>

      {/* interaktiv progressbar — qizil/sariq/yashil */}
      <div className="mt-2.5">
        <div className="mb-1 flex items-center justify-between text-[10.5px]">
          <span className="text-foreground/50">To'lov darajasi</span>
          <span className="font-semibold tabular-nums" style={{ color }}>{tax.payRate}% · {label}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/8">
          <div className="asosiy-grow h-full rounded-full transition-all" style={{ width: `${Math.max(tax.payRate, 2)}%`, background: color }} />
        </div>
        <div className="mt-1 flex justify-between text-[8.5px] text-foreground/30">
          <span>0%</span><span>40%</span><span>80%</span><span>100%</span>
        </div>
      </div>
    </Section>
  );
}

// Tailwind JIT purge'iga tushmasligi uchun aniq class xaritasi
const OFFICER_ACCENT = {
  indigo: "bg-indigo-500/15 text-indigo-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
  rose: "bg-rose-500/15 text-rose-300",
};

// Umumiy "biriktirilgan xodim" kartochkasi (soliq/murojaat/tibbiyot)
function OfficerCard({ title, officer, icon: Icon = BadgeCheck, accent = "indigo", extra }) {
  return (
    <Section title={title}>
      <div className="flex items-center gap-3">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", OFFICER_ACCENT[accent])}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-tight">{officer.name}</p>
          <p className="truncate text-[10.5px] text-foreground/45">{officer.title} · {extra || officer.sector}</p>
        </div>
      </div>
      <a href={`tel:${officer.phone.replace(/\s/g, "")}`} className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-[rgb(var(--card-border))] bg-card/40 py-1.5 text-[11px] text-foreground/75 transition-colors hover:text-foreground">
        <Phone className="size-3.5" /> {officer.phone}
      </a>
    </Section>
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
  // uy → rasmga mos qatorli faktlar + soliq holati (progressbar) + xodim
  if (info.type === "uy" && info.tax) {
    return (
      <>
        <FactRows facts={info.facts} />
        <TaxStatus tax={info.tax} />
        <OfficerCard title="Biriktirilgan xodim (soliq)" officer={info.tax.officer} icon={BadgeCheck} accent="indigo" />
      </>
    );
  }
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

// kichik nomli progressbar (ratio 0-100), qizil/sariq/yashil
function LabeledBar({ label, value, total, percent, color }) {
  const pct = percent ?? Math.round((value / Math.max(1, total)) * 100);
  const c = color ?? (pct >= 80 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444");
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-foreground/60">{label}</span>
        <span className="font-semibold tabular-nums" style={{ color: c }}>
          {value != null && total != null ? `${fmt(value)}/${fmt(total)} · ` : ""}{pct}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
        <div className="asosiy-grow h-full rounded-full" style={{ width: `${Math.max(pct, 2)}%`, background: c }} />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2">
      <Icon className="size-3.5 shrink-0" style={{ color: color || "currentColor", opacity: color ? 1 : 0.4 }} />
      <span className="text-[11px] text-foreground/55">{label}</span>
      <span className="ml-auto text-[12px] font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function AppealsTab({ info }) {
  const appeals = info.appeals || [];
  const h = info.household;
  const st = info.appealStats || { total: appeals.length, done: 0, progress: 0, rejected: 0 };

  return (
    <>
      {/* ===== Xonadon ma'lumotlari ===== */}
      {h && (
        <Section title="Xonadon ma'lumotlari">
          <div className="rounded-lg border border-[rgb(var(--card-border))] bg-card/40 divide-y divide-[rgb(var(--card-border))]">
            <InfoRow icon={User} label="Xonadon egasi" value={h.owner} />
            <InfoRow icon={HeartHandshake} label="Oilalar soni" value={`${h.families} ta`} />
            <InfoRow icon={Users} label="Fuqarolar soni" value={`${fmt(h.residents)} kishi`} />
            <InfoRow icon={Users} label="Ayollar / erkaklar" value={`${fmt(h.women)} / ${fmt(h.men)}`} />
          </div>
        </Section>
      )}

      {/* ===== Daftarlar (yoshlar / ayollar) ===== */}
      {h && (
        <Section title="Daftarlar bo'yicha hisobot">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-amber-300/70">Yoshlar daftari</p>
              <p className="mt-0.5 text-xl font-semibold tabular-nums text-amber-400">{h.youthLedger}</p>
              <p className="text-[9.5px] text-foreground/40">14-30 yosh · {Math.round((h.youthLedger / Math.max(1, h.residents)) * 100)}%</p>
            </div>
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-rose-300/70">Ayollar daftari</p>
              <p className="mt-0.5 text-xl font-semibold tabular-nums text-rose-400">{h.womenLedger}</p>
              <p className="text-[9.5px] text-foreground/40">e'tiborga muhtoj · {Math.round((h.womenLedger / Math.max(1, h.women)) * 100)}%</p>
            </div>
          </div>
        </Section>
      )}

      {/* ===== Bandlik ===== */}
      {h && (
        <Section title="Bandlik holati">
          <div className="mb-2 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
              <p className="flex items-center justify-center gap-1 text-base font-semibold tabular-nums text-emerald-400"><Briefcase className="size-3.5" /> {h.employed}</p>
              <p className="text-[9.5px] text-foreground/40">Ishli</p>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2">
              <p className="flex items-center justify-center gap-1 text-base font-semibold tabular-nums text-red-400"><UserX className="size-3.5" /> {h.unemployed}</p>
              <p className="text-[9.5px] text-foreground/40">Ishsiz</p>
            </div>
          </div>
          <LabeledBar label="Bandlik darajasi" value={h.employed} total={h.workforce} />
        </Section>
      )}

      {/* ===== Gaz balloni ta'minoti (oila soniga ko'ra) ===== */}
      {h && (
        <Section title="Gaz balloni ta'minoti">
          <div className="mb-2 flex items-end justify-between">
            <div className="flex items-center gap-2">
              <Cylinder className="size-5 text-sky-400" />
              <div>
                <p className="text-lg font-semibold tabular-nums leading-none">{h.gas.cylinders} <span className="text-[11px] font-normal text-foreground/45">/ {h.families} oila</span></p>
                <p className="mt-0.5 text-[9.5px] text-foreground/40">ballon bilan ta'minlangan</p>
              </div>
            </div>
          </div>
          <LabeledBar label="Qamrov darajasi" percent={h.gas.coverage} value={h.gas.cylinders} total={h.families} />
        </Section>
      )}

      {/* ===== Murojaatlar hisoboti ===== */}
      <Section title="Murojaatlar hisoboti">
        {st.total === 0 ? (
          <p className="flex items-center gap-1.5 py-1 text-[12px] text-foreground/50"><Inbox className="size-4" /> Murojaat yo'q</p>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center">
            <StatBox value={st.total} label="Jami" color="#38bdf8" />
            <StatBox value={st.done} label="Hal qilindi" color="#10b981" />
            <StatBox value={st.progress} label="Jarayonda" color="#f59e0b" />
            <StatBox value={st.rejected} label="Rad etildi" color="#ef4444" />
          </div>
        )}
      </Section>

      {/* ===== So'nggi murojaatlar ===== */}
      {appeals.length > 0 && (
        <Section title="So'nggi murojaatlar">
          <div className="flex flex-col gap-1.5">
            {appeals.map((a) => (
              <div key={a.number} className="rounded-lg border border-[rgb(var(--card-border))] bg-card/40 p-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12px] font-medium leading-tight">{a.topic}</p>
                  <span className={cn("shrink-0 rounded-md border px-1.5 py-px text-[9px] font-bold", a.overdue ? TONE.danger : TONE[a.status.tone])}>
                    {a.overdue ? "Muddati o'tdi" : a.status.label}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-foreground/40">
                  <span className="font-mono">{a.number}</span>
                  <span className="flex items-center gap-0.5"><Clock className="size-3" /> {a.daysAgo} kun oldin</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== Biriktirilgan xodimlar ===== */}
      {info.appealOfficer && (
        <OfficerCard title="Murojaatlar bo'yicha xodim" officer={info.appealOfficer} icon={MessageSquare} accent="emerald" />
      )}
      {info.medic && (
        <OfficerCard title="Biriktirilgan tibbiyot xodimi" officer={info.medic} icon={Stethoscope} accent="rose" extra={info.medic.facility} />
      )}
    </>
  );
}

// kategoriya sarlavhali blok (ikona + accent chiziq)
function CatSection({ icon: Icon, title, color, badge, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[rgb(var(--card-border))] bg-card/40">
      <div className="flex items-center gap-2 border-b border-[rgb(var(--card-border))] px-3 py-2" style={{ background: `${color}10` }}>
        <span className="grid size-6 place-items-center rounded-md" style={{ background: `${color}22`, color }}>
          <Icon className="size-3.5" />
        </span>
        <p className="text-[12px] font-semibold">{title}</p>
        {badge}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function ServicesSafetyTab({ info }) {
  const s = info.services;
  const sec = info.safety;
  if (!s || !sec) return <Facts facts={info.facts} />;
  const { internet: net, gas, electric: el, sanitation: san } = s;
  const { fire, crime } = sec;

  return (
    <div className="asosiy-stagger flex flex-col gap-3">
      {/* ===== Internet ===== */}
      <CatSection
        icon={net.connected ? Wifi : WifiOff}
        title="Internet / Wi-Fi"
        color="#38bdf8"
        badge={
          <span className={cn("ml-auto rounded-md border px-1.5 py-px text-[9px] font-bold", net.connected ? TONE.success : TONE.danger)}>
            {net.connected ? "Ulangan" : "Yo'q"}
          </span>
        }
      >
        {net.connected ? (
          <>
            <div className="mb-2 flex items-end gap-2">
              <p className="text-2xl font-semibold tabular-nums text-sky-400">{net.speed}</p>
              <p className="pb-1 text-[11px] text-foreground/45">Mbit/s · {net.tech}</p>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1"><span className="text-foreground/50">Provayder</span><span className="font-medium">{net.provider}</span></div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1"><span className="text-foreground/50">Texnologiya</span><span className="font-medium">{net.tech}</span></div>
            </div>
            <LabeledBar label="Aloqa sifati" percent={net.quality} color={net.quality >= 70 ? "#10b981" : "#f59e0b"} />
          </>
        ) : (
          <p className="flex items-center gap-1.5 text-[12px] text-foreground/50"><WifiOff className="size-4" /> Internetga ulanmagan</p>
        )}
      </CatSection>

      {/* ===== Gaz ===== */}
      <CatSection
        icon={gas.type === "natural" ? Flame : Cylinder}
        title="Gaz ta'minoti"
        color="#22d3ee"
        badge={<span className="ml-auto rounded-md border border-cyan-500/30 bg-cyan-500/15 px-1.5 py-px text-[9px] font-bold text-cyan-300">{gas.typeLabel}</span>}
      >
        {gas.type === "natural" ? (
          <>
            <div className="mb-2 flex items-end justify-between">
              <div><p className="text-2xl font-semibold tabular-nums text-cyan-400">{fmt(gas.monthly)}</p><p className="text-[10px] text-foreground/45">m³ / oy · {gas.meter}</p></div>
              <span className={cn("rounded-md border px-1.5 py-px text-[9px] font-bold", gas.pressure === "Normal" ? TONE.success : TONE.warning)}>Bosim: {gas.pressure}</span>
            </div>
            <LabeledBar label="500 m³ yillik limit" value={gas.monthly * 12} total={gas.limit} percent={Math.min(100, Math.round((gas.monthly * 12 / gas.limit) * 100))} />
            <p className="mt-1 text-[9.5px] text-foreground/40">Yillik bashorat: {fmt(gas.monthly * 12)} m³ / {gas.limit} m³ limit</p>
          </>
        ) : (
          <>
            {/* har 30 kunlik yetkazib berish tsikli — oxirgi → keyingi izchil */}
            <div className="mb-2 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white/5 p-2">
                <p className="text-[9px] uppercase tracking-wide text-foreground/40">Oxirgi yetkazildi</p>
                <p className="mt-0.5 text-[13px] font-semibold leading-tight text-foreground/90">{gas.lastDelivery}</p>
                <p className="text-[9px] text-foreground/40">{gas.sinceDelivery} kun oldin</p>
              </div>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">
                <p className="text-[9px] uppercase tracking-wide text-amber-300/70">Keyingi yetkazib berish</p>
                <p className="mt-0.5 text-[13px] font-semibold leading-tight text-amber-300">{gas.nextDelivery}</p>
                <p className="text-[9px] text-foreground/40">{gas.nextDue} kundan keyin</p>
              </div>
            </div>

            {/* tsikl progressi */}
            <LabeledBar
              label={`${gas.cycleDays} kunlik tsikl`}
              percent={Math.round((gas.sinceDelivery / gas.cycleDays) * 100)}
              color={gas.nextDue <= 5 ? "#ef4444" : gas.nextDue <= 12 ? "#f59e0b" : "#22c55e"}
            />

            <div className="mt-2 flex items-center justify-between text-[10px] text-foreground/45">
              <span className="flex items-center gap-1"><Cylinder className="size-3.5 text-cyan-400" /> {gas.cylinders} ballon</span>
              <span>Yetkazib beruvchi: {gas.provider}</span>
            </div>
          </>
        )}
      </CatSection>

      {/* ===== Elektr ===== */}
      <CatSection icon={Zap} title="Elektr energiya" color="#f59e0b">
        <div className="mb-2 flex items-end gap-2">
          <p className="text-2xl font-semibold tabular-nums text-amber-400">{fmt(el.usage)}</p>
          <p className="pb-1 text-[11px] text-foreground/45">kVt·soat / oy</p>
        </div>
        <LabeledBar
          label="200 kVt ijtimoiy norma"
          value={el.usage}
          total={el.norm}
          percent={Math.min(100, Math.round((el.usage / el.norm) * 100))}
          color={el.usage <= el.norm ? "#10b981" : el.usage <= 350 ? "#f59e0b" : "#ef4444"}
        />
        <p className="mt-1 text-[9.5px] text-foreground/40">
          {el.usage <= el.norm ? `Norma ichida (${el.norm - el.usage} kVt qoldi)` : `Normadan ${fmt(el.overNorm)} kVt oshgan`}
        </p>

        {/* quyosh panel tavsiyasi */}
        {el.recommendSolar && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2">
            <Lightbulb className="size-4 shrink-0 text-amber-400" />
            <p className="text-[11px] leading-snug text-amber-200">Sarf 350 kVt dan oshgan — <b>quyosh paneli</b> o'rnatish tavsiya etiladi (xarajatni ~40% kamaytiradi).</p>
          </div>
        )}

        {/* quyosh panel holati */}
        <div className="mt-2 rounded-lg border border-[rgb(var(--card-border))] bg-white/5 p-2.5">
          <div className="flex items-center gap-2">
            <Sun className={cn("size-4", el.solar.installed ? "text-yellow-400" : "text-foreground/30")} />
            <span className="text-[11px] font-medium">Quyosh paneli</span>
            <span className={cn("ml-auto rounded-md border px-1.5 py-px text-[9px] font-bold", el.solar.installed ? TONE.success : "border-[rgb(var(--card-border))] text-foreground/45")}>
              {el.solar.installed ? "O'rnatilgan" : "Yo'q"}
            </span>
          </div>
          {el.solar.installed && (
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-sm font-semibold tabular-nums text-yellow-400">{el.solar.capacity}</p><p className="text-[9px] text-foreground/40">kVt quvvat</p></div>
              <div><p className="text-sm font-semibold tabular-nums text-emerald-400">{fmt(el.solar.generated)}</p><p className="text-[9px] text-foreground/40">ishlab chiqdi</p></div>
              <div><p className="text-sm font-semibold tabular-nums text-sky-400">{el.solar.selling ? fmt(el.solar.sold) : "—"}</p><p className="text-[9px] text-foreground/40">tarmoqqa sotdi</p></div>
            </div>
          )}
        </div>
      </CatSection>

      {/* ===== Obodonlashtirish ===== */}
      <CatSection icon={Trash2} title="Obodonlashtirish · Axlat" color="#10b981">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
          <Truck className="size-7 shrink-0 text-emerald-400" />
          <div className="flex-1">
            <p className="text-[10px] text-foreground/45">Oxirgi marta axlat olib ketildi</p>
            <p className="text-[14px] font-semibold leading-tight">{san.lastPickup}</p>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="rounded-lg bg-white/5 p-2"><p className="font-semibold text-foreground/85">{san.schedule}</p><p className="text-[9px] text-foreground/40">jadval</p></div>
          <div className="rounded-lg bg-white/5 p-2"><p className="font-semibold text-emerald-400">{san.nextPickup}</p><p className="text-[9px] text-foreground/40">keyingisi</p></div>
          <div className="rounded-lg bg-white/5 p-2"><p className="font-semibold tabular-nums text-foreground/85">{san.bins}</p><p className="text-[9px] text-foreground/40">konteyner</p></div>
        </div>
      </CatSection>

      {/* ===== Xavfsizlik bo'limi sarlavhasi ===== */}
      <div className="mt-1 flex items-center gap-2 px-1">
        <ShieldCheck className="size-4 text-rose-400" />
        <p className="text-[11px] font-bold uppercase tracking-wide text-foreground/55">Xavfsizlik</p>
        <div className="ml-1 h-px flex-1 bg-[rgb(var(--card-border))]" />
      </div>

      {/* ===== Yong'in xavfi ===== */}
      <CatSection
        icon={FlameKindling}
        title="Yong'in xavfsizligi"
        color="#ef4444"
        badge={<span className={cn("ml-auto rounded-md border px-1.5 py-px text-[9px] font-bold", TONE[fire.tone])}>{fire.status}</span>}
      >
        {/* interaktiv xavf gauge */}
        <div className="mb-2 flex items-center gap-3">
          <div
            className={cn("relative grid size-16 shrink-0 place-items-center rounded-full", fire.risk >= 60 && "asosiy-risk-pulse")}
            style={{
              background: `conic-gradient(${fire.tone === "danger" ? "#ef4444" : fire.tone === "warning" ? "#f59e0b" : "#10b981"} ${fire.risk * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              "--risk-glow": fire.tone === "danger" ? "rgba(239,68,68,0.4)" : "rgba(245,158,11,0.35)",
            }}
          >
            <div className="grid size-12 place-items-center rounded-full bg-[#0b0f17]">
              <span className="text-[15px] font-bold tabular-nums" style={{ color: fire.tone === "danger" ? "#f87171" : fire.tone === "warning" ? "#fbbf24" : "#34d399" }}>{fire.risk}%</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-foreground/45">Yong'in ehtimoli</p>
            <p className="text-[13px] font-semibold leading-tight">{fire.status}</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-foreground/45"><Clock className="size-3" /> Tekshiruv: {fire.lastInspection}</p>
          </div>
        </div>
        <div className="rounded-lg border border-[rgb(var(--card-border))] bg-white/5 px-2.5 py-2">
          <p className="mb-0.5 text-[9.5px] uppercase tracking-wide text-foreground/40">Inspektor xulosasi</p>
          <p className="text-[11px] leading-snug text-foreground/80">{fire.findings}</p>
        </div>
        <div className="mt-2">
          <OfficerCard title="Yong'in xavfsizligi xodimi (FVV)" officer={fire.inspector} icon={ShieldAlert} accent="rose" extra={fire.inspector.department} />
        </div>
      </CatSection>

      {/* ===== Jinoyatlar ===== */}
      <CatSection
        icon={crime.clean ? ShieldCheck : ShieldAlert}
        title="Jamoat xavfsizligi (1 yil)"
        color={crime.clean ? "#10b981" : "#ef4444"}
        badge={<span className={cn("ml-auto rounded-md border px-1.5 py-px text-[9px] font-bold", crime.clean ? TONE.success : TONE.danger)}>{crime.clean ? "Toza" : `${crime.count} holat`}</span>}
      >
        {crime.clean ? (
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
            <Activity className="size-5 shrink-0 text-emerald-400" />
            <p className="text-[12px] text-emerald-300">So'nggi 1 yilda jinoyat qayd etilmagan — barqaror holat.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-red-300">{crime.lastIncident.type}</span>
              <span className={cn("rounded-md border px-1.5 py-px text-[9px] font-bold", crime.lastIncident.resolved ? TONE.success : TONE.warning)}>{crime.lastIncident.resolved ? "Hal qilingan" : "Ko'rib chiqilmoqda"}</span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-foreground/45"><Clock className="size-3" /> {crime.lastIncident.date}</p>
          </div>
        )}
        <div className="mt-2">
          <OfficerCard title="Profilaktika inspektori" officer={crime.inspector} icon={BadgeCheck} accent="indigo" extra="Mahalla" />
        </div>
      </CatSection>
    </div>
  );
}

function FarmingTab({ info }) {
  const f = info.farming;
  if (!f) return <Facts facts={info.facts} />;

  return (
    <div className="asosiy-stagger flex flex-col gap-3">
      {/* ===== Tomorqadan foydalanish ===== */}
      <CatSection
        icon={Sprout}
        title="Tomorqadan foydalanish"
        color="#10b981"
        badge={
          <span className={cn("ml-auto rounded-md border px-1.5 py-px text-[9px] font-bold", f.harvestsPerYear > 0 ? TONE.success : "border-[rgb(var(--card-border))] text-foreground/45")}>
            {f.harvestsPerYear > 0 ? `Yiliga ${f.harvestsPerYear} marta` : "Foydalanilmaydi"}
          </span>
        }
      >
        {f.harvestsPerYear > 0 ? (
          <div className="grid grid-cols-3 gap-2 text-center">
            <StatBox value={f.harvestsPerYear} label="Yillik hosil" color="#10b981" />
            <StatBox value={`${fmt(f.totalHarvestKg)} kg`} label="Jami hosil" color="#22d3ee" />
            <StatBox value={`${f.gardenArea} sotix`} label="Maydon" color="#f59e0b" />
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-[12px] text-foreground/50"><Sprout className="size-4" /> Bu yil tomorqa ekilmagan</p>
        )}
      </CatSection>

      {/* ===== Har bir hosil ===== */}
      {f.harvests.map((h) => (
        <CatSection
          key={h.order}
          icon={Wheat}
          title={`${h.order}-hosil · ${h.season}`}
          color="#84cc16"
          badge={<span className="ml-auto text-base">{h.emoji}</span>}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-semibold">{h.crop}</span>
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-foreground/70">{h.sotix} sotixga ekilgan</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white/5 p-2"><p className="text-sm font-semibold tabular-nums text-lime-400">{fmt(h.yieldKg)}</p><p className="text-[9px] text-foreground/40">kg hosil</p></div>
            <div className="rounded-lg bg-white/5 p-2"><p className="text-sm font-semibold tabular-nums text-foreground/85">{fmt(h.pricePerKg)}</p><p className="text-[9px] text-foreground/40">so'm/kg</p></div>
            <div className="rounded-lg bg-emerald-500/10 p-2"><p className="text-sm font-semibold tabular-nums text-emerald-400">{fmt(h.income)}</p><p className="text-[9px] text-foreground/40">daromad</p></div>
          </div>
        </CatSection>
      ))}

      {/* ===== Umumiy daromad ===== */}
      {f.harvestsPerYear > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-200"><Coins className="size-4" /> Tomorqadan yillik daromad</span>
          <span className="text-[14px] font-semibold tabular-nums text-emerald-400">{fmt(f.totalFarmIncome)} so'm</span>
        </div>
      )}

      {/* ===== Chorvachilik ===== */}
      <CatSection
        icon={Egg}
        title="Chorvachilik"
        color="#f59e0b"
        badge={
          <span className={cn("ml-auto rounded-md border px-1.5 py-px text-[9px] font-bold", f.hasLivestock ? TONE.success : "border-[rgb(var(--card-border))] text-foreground/45")}>
            {f.hasLivestock ? "Mavjud" : "Yo'q"}
          </span>
        }
      >
        {f.hasLivestock ? (
          <div className="grid grid-cols-2 gap-2">
            {f.livestock.filter((l) => l.count > 0).map((l) => (
              <div key={l.key} className="flex items-center gap-2.5 rounded-lg border border-[rgb(var(--card-border))] bg-white/5 px-2.5 py-2">
                <span className="text-xl leading-none">{l.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold tabular-nums leading-none">{l.count} <span className="text-[10px] font-normal text-foreground/45">bosh</span></p>
                  <p className="mt-0.5 truncate text-[10px] text-foreground/45">{l.label}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-[12px] text-foreground/50"><Egg className="size-4" /> Chorva mol-mulki yo'q</p>
        )}
      </CatSection>
    </div>
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
        { key: "murojaat", label: "Murojaat", icon: MessageSquare, render: AppealsTab },
        { key: "xizmat", label: "Xizmat", icon: ShieldCheck, render: ServicesSafetyTab },
        { key: "tomorqa", label: "Tomorqa", icon: Sprout, render: FarmingTab },
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

const DetailPanel = ({ element, statusTone, onClose }) => {
  const info = elementInfo(element);
  const [active, setActive] = useState("overview");
  if (!info) return null;
  const meta = info.typeMeta;
  const tabs = tabsForType(info);
  const current = tabs.find((t) => t.key === active) || tabs[0];
  const Body = current.render;
  // faol filter rangi (xarita statusi bilan mos)
  const st = statusTone ? STATUS_TONES[statusTone] : null;

  return (
    <div
      key={info.id}
      className="asosiy-slide relative flex h-full flex-col gap-3 overflow-hidden pr-1"
      style={st ? { boxShadow: `inset 4px 0 0 ${st.color}` } : undefined}
    >
      {/* faol filter status banneri — yon panel xarita rangiga mos */}
      {st && (
        <div
          className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
          style={{ borderColor: `${st.color}55`, background: `${st.color}1a` }}
        >
          <span className="size-2.5 rounded-full" style={{ background: st.color }} />
          <span className="text-[11px] font-semibold" style={{ color: st.color }}>{st.label}</span>
          <span className="ml-auto text-[10px] text-foreground/50">filter bo'yicha holat</span>
        </div>
      )}

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
          <p className="truncate font-mono text-[11px] text-foreground/45">{info.cadastre || info.subtitle}</p>
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
                title={t.label}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1.5 text-[10px] font-medium transition-colors",
                  on ? "bg-foreground/10 text-foreground" : "text-foreground/45 hover:text-foreground/75",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="max-w-full truncate">{t.label}</span>
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
        Kadastr: <span className="font-mono">{info.cadastre}</span> · namunaviy ma'lumot
      </p>
    </div>
  );
};

export default DetailPanel;
