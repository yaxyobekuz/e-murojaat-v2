// Internet qamrov xaritasi — Mapbox 3D (yer kadastri uslubida): har uy extruded blok,
// balandligi/rangi internet tezligiga qarab. Antennalar + qamrov zonasi.
import { Antenna, SignalHigh, Users, Wifi, Home } from "lucide-react";

import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import { ANTENNAS, ANTENNA_STATUS, houseSpeedSummary, HOUSES, HOUSE_SPEED } from "../mock/internet.data";
import InternetMapbox from "./InternetMapbox";

const ACCENT = "#06b6d4";

const InternetCoverageMap = () => {
  const avgSignal = Math.round(ANTENNAS.reduce((s, a) => s + a.signal, 0) / ANTENNAS.length);
  const weak = ANTENNAS.filter((a) => a.status === "weak").length;
  const hs = houseSpeedSummary;

  return (
    <GlassChartCard
      title="Internet qamrov xaritasi — antennalar, signal sifati va uy tezliklari"
      insight={
        weak
          ? `${weak} ta antenna zaif signal beryapti · uylarda o'rtacha ${hs.avg} Mbit/s`
          : `Antennalar me'yorda · uylarda o'rtacha ${hs.avg} Mbit/s`
      }
      bodyClassName="!mt-3"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Mapbox 3D xarita */}
        <div className="lg:col-span-2">
          <InternetMapbox />
        </div>

        {/* Yon panel */}
        <div className="flex flex-col gap-3">
          {/* Uy tezligi yig'indisi */}
          <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
              <Home className="size-3.5" style={{ color: ACCENT }} /> Uy tezliklari ({hs.total} uy)
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "O'rtacha", value: `${hs.avg}`, unit: "Mbit/s", c: ACCENT },
                { label: "Tez (50+)", value: hs.fast, unit: "uy", c: "#22c55e" },
                { label: "Sekin", value: hs.slow, unit: "uy", c: "#f59e0b" },
              ].map((m, i) => (
                <div key={i} className="rounded-lg border border-[rgb(var(--card-border))] bg-card/60 px-2 py-1.5">
                  <div className="font-mono text-[15px] font-bold tabular-nums" style={{ color: m.c }}>{m.value}</div>
                  <div className="text-[9px] text-foreground/45">{m.label} · {m.unit}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 space-y-1">
              {Object.entries(HOUSE_SPEED).map(([key, s]) => {
                const n = HOUSES.filter((h) => h.status === key).length;
                const pct = Math.round((n / HOUSES.length) * 100);
                return (
                  <div key={key} className="flex items-center gap-2 text-[10.5px]">
                    <span className="size-2 rounded-sm" style={{ background: s.color }} />
                    <span className="flex-1 text-foreground/65">{s.label}</span>
                    <span className="font-mono tabular-nums text-foreground/55">{n} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Antennalar ro'yxati */}
          <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
                <Antenna className="size-3.5" style={{ color: ACCENT }} /> Antennalar ({ANTENNAS.length})
              </span>
              <span className="text-[11px] text-foreground/55">O'rtacha: <b style={{ color: ANTENNA_STATUS[avgSignal >= 80 ? "good" : avgSignal >= 55 ? "mid" : "weak"].color }}>{avgSignal}%</b></span>
            </div>
            <div className="flex-1 space-y-1.5 overflow-auto">
              {[...ANTENNAS].sort((a, b) => b.signal - a.signal).map((a) => {
                const c = ANTENNA_STATUS[a.status].color;
                return (
                  <div key={a.id} className="rounded-lg border border-[rgb(var(--card-border))] bg-card/60 px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="grid size-5 place-items-center rounded-md text-[9px] font-bold text-white" style={{ background: c }}>
                        {a.tech.includes("5G") ? "5G" : "4G"}
                      </span>
                      <span className="flex-1 truncate text-[11px] font-medium text-foreground">{a.name}</span>
                      <span className="font-mono text-[11px] font-bold tabular-nums" style={{ color: c }}>{a.signal}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-foreground/5">
                      <div className="h-full rounded-full" style={{ width: `${a.signal}%`, background: c }} />
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[9.5px] text-foreground/50">
                      <span className="flex items-center gap-0.5"><Wifi className="size-2.5" /> {a.provider}</span>
                      <span className="flex items-center gap-0.5"><SignalHigh className="size-2.5" /> {a.coverageM} m</span>
                      <span className="flex items-center gap-0.5"><Users className="size-2.5" /> {a.users.toLocaleString("uz-UZ")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </GlassChartCard>
  );
};

export default InternetCoverageMap;
