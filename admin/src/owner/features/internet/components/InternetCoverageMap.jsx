// Internet qamrov xaritasi — real 3D Google xarita ustida antennalar (bazaviy stansiyalar)
// va ularning signal sifati + qamrov zonasi.
import { Antenna, SignalHigh, Users, Wifi } from "lucide-react";

import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import { ObodRealMap } from "@/owner/features/obodonlashtirish/components/insight/ObodRealMap";
import { ANTENNAS, ANTENNA_STATUS } from "../mock/internet.data";

const ACCENT = "#06b6d4";

// markaz + radius(m) dan doira poligon (zona uchun)
const circle = (lat, lng, radiusM, steps = 18) => {
  const latM = radiusM / 111000;
  const lngM = radiusM / (111000 * Math.cos((lat * Math.PI) / 180));
  return Array.from({ length: steps }, (_, i) => {
    const ang = (i / steps) * Math.PI * 2;
    return {
      lat: Math.round((lat + Math.sin(ang) * latM) * 1e6) / 1e6,
      lng: Math.round((lng + Math.cos(ang) * lngM) * 1e6) / 1e6,
    };
  });
};

const InternetCoverageMap = () => {
  // antenna markerlari (📡, rang signal sifatiga qarab)
  const markers = ANTENNAS.map((a) => ({
    lat: a.lat,
    lng: a.lng,
    glyph: a.tech.includes("5G") ? "5G" : "4G",
    glyphColor: "#ffffff",
    color: ANTENNA_STATUS[a.status].color,
    borderColor: "#0b1220",
    scale: 1.35,
    label: `${a.name} · ${a.signal}%`,
  }));

  // qamrov zonalari (signal radiusi, rangi sifatga qarab)
  const zones = ANTENNAS.map((a) => ({
    polygon: circle(a.lat, a.lng, a.coverageM),
    color: ANTENNA_STATUS[a.status].color,
  }));

  const avgSignal = Math.round(ANTENNAS.reduce((s, a) => s + a.signal, 0) / ANTENNAS.length);
  const weak = ANTENNAS.filter((a) => a.status === "weak").length;

  return (
    <GlassChartCard
      title="Internet qamrov xaritasi — antennalar va signal sifati"
      insight={
        weak
          ? `${weak} ta antenna zaif signal beryapti — quvvatlash yoki yangi stansiya kerak`
          : "Barcha antennalar me'yoriy signal beryapti"
      }
      bodyClassName="!mt-3"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Xarita */}
        <div className="lg:col-span-2">
          <ObodRealMap
            accent={ACCENT}
            height={360}
            bare
            range={1400}
            markers={markers}
            zones={zones}
            label="Antennalar va qamrov zonalari"
            legend={[
              { label: "Yaxshi signal", color: "#22c55e" },
              { label: "O'rtacha signal", color: "#f59e0b" },
              { label: "Zaif signal", color: "#ef4444" },
            ]}
          />
        </div>

        {/* Antennalar ro'yxati */}
        <div className="flex flex-col rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3">
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
    </GlassChartCard>
  );
};

export default InternetCoverageMap;
