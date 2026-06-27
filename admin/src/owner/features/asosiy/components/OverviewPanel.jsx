// Hech narsa tanlanmaganda — Sarnovul mahallasining umumiy ma'lumotlari.
import { MapPin } from "lucide-react";

import MiniDonut from "./MiniDonut";
import { OVERVIEW } from "../data/mahallaData";
import { TYPE_COUNTS, ELEMENT_TYPES } from "../data/mapElements";

const nf = (v) => Math.round(v).toLocaleString("uz-UZ").replace(/,/g, " ");

function Bar({ label, value, color }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-foreground/70">{label}</span>
        <span className="font-semibold tabular-nums" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <div className="asosiy-grow h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

const OverviewPanel = () => {
  const popTotal = OVERVIEW.population.reduce((s, p) => s + p.value, 0);
  return (
    <div className="asosiy-fade flex h-full flex-col gap-3 overflow-y-auto pr-1">
      {/* sarlavha */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-cyan-400">
          <MapPin className="size-3.5" /> {OVERVIEW.region}
        </div>
        <h2 className="mt-0.5 text-lg font-semibold leading-tight tracking-tight">{OVERVIEW.name}</h2>
        <p className="text-[11px] text-foreground/45">Mahalla bo'yicha umumiy ko'rsatkichlar · namunaviy ma'lumot</p>
      </div>

      {/* hero KPI */}
      <div className="grid grid-cols-2 gap-2">
        {OVERVIEW.hero.map((h) => (
          <div key={h.label} className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-2.5">
            <p className="text-[10px] uppercase tracking-wide text-foreground/40">{h.label}</p>
            <p className="text-xl font-semibold tabular-nums leading-tight">{h.value}</p>
            <p className="text-[10px] text-foreground/40">{h.sub}</p>
          </div>
        ))}
      </div>

      {/* aholi tarkibi (donut) */}
      <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3">
        <p className="mb-3 text-[11px] font-semibold text-foreground/75">Aholi tarkibi</p>
        <MiniDonut data={OVERVIEW.population} size={132} thickness={20} centerLabel={nf(popTotal)} />
      </div>

      {/* infratuzilma qamrovi */}
      <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3">
        <p className="mb-2.5 text-[11px] font-semibold text-foreground/75">Kommunal infratuzilma qamrovi</p>
        <div className="flex flex-col gap-2.5">
          {OVERVIEW.coverage.map((c) => (
            <Bar key={c.label} {...c} />
          ))}
        </div>
      </div>

      {/* xaritadagi obyektlar (real SVG hisobi) + ijtimoiy obyektlar */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3">
          <p className="mb-2 text-[11px] font-semibold text-foreground/75">Xaritadagi obyektlar</p>
          <div className="flex flex-col gap-1.5">
            {Object.values(ELEMENT_TYPES).map((m) => (
              <div key={m.key} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-foreground/70">
                  <span className="size-2 rounded-sm" style={{ background: m.color }} /> {m.plural}
                </span>
                <span className="font-semibold tabular-nums">{nf(TYPE_COUNTS[m.key] || 0)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3">
          <p className="mb-2 text-[11px] font-semibold text-foreground/75">Ijtimoiy obyektlar</p>
          <div className="flex flex-col gap-1.5">
            {OVERVIEW.facilities.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-foreground/70">
                    <Icon className="size-3 text-foreground/45" /> {f.label}
                  </span>
                  <span className="font-semibold tabular-nums">{f.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-auto pt-1 text-center text-[10px] text-foreground/35">
        Xaritadan istalgan obyektni tanlab, batafsil ma'lumot oling
      </p>
    </div>
  );
};

export default OverviewPanel;
