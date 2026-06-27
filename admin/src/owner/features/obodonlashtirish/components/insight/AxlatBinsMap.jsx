// Chiqindi xaritasi — real 3D Google xarita (daraxtlar xaritasi uslubida).
// Markerlar: chiqindi qutilari (to'lganlik % yorlig'i) + olib ketuvchi mashina.
import { Truck, Trash2, AlertTriangle, LogIn, LogOut, MapPin } from "lucide-react";

import { hexA } from "@/shared/components/ui/command/primitives";
import useObjectState from "@/shared/hooks/useObjectState";
import { ObodRealMap } from "./ObodRealMap";
import {
  BINS_BY_MAHALLA, binMahallaStats, BIN_STATUS,
  TRUCKS_BY_MAHALLA, TRUCK_STATUS, truckForMahalla,
} from "../../mock/smartBins.data";

const ACCENT = "#22d3ee";

const fillColor = (pct) => (pct > 70 ? "#ef4444" : pct > 45 ? "#f59e0b" : "#22c55e");

const AxlatBinsMap = () => {
  const { mahalla, setField } = useObjectState({ mahalla: BINS_BY_MAHALLA[0].mahalla });
  const current = BINS_BY_MAHALLA.find((m) => m.mahalla === mahalla) || BINS_BY_MAHALLA[0];
  const stat = binMahallaStats.find((s) => s.mahalla === mahalla);
  const truck = truckForMahalla(mahalla);
  const ts = TRUCK_STATUS[truck.status];

  // Xarita markerlari — qutilar (rangli pin, ichida foiz raqami) + mashina (oq glyphli pin)
  const binMarkers = current.bins.map((b) => ({
    lat: b.lat,
    lng: b.lng,
    glyph: `${b.fill}`,
    glyphColor: "#ffffff",
    color: BIN_STATUS[b.status].color,
    borderColor: "#0b1220",
    scale: 1.15,
    label: `${b.fill}%`,
  }));
  const truckMarker = {
    lat: truck.lat,
    lng: truck.lng,
    glyph: "T",
    glyphColor: "#ffffff",
    color: ts.color,
    borderColor: "#0b1220",
    scale: 1.5,
    label: truck.plate,
  };
  const markers = [...binMarkers, truckMarker];

  return (
    <div className="p-3">
      {/* Mahalla tanlash */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-foreground/50">Mahalla:</span>
        {BINS_BY_MAHALLA.map(({ mahalla: m }) => {
          const ms = binMahallaStats.find((s) => s.mahalla === m);
          const active = m === mahalla;
          return (
            <button key={m} onClick={() => setField("mahalla", m)}
              className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors"
              style={active ? { borderColor: hexA(ACCENT, 0.5), background: hexA(ACCENT, 0.12), color: ACCENT } : { borderColor: "rgb(var(--card-border))", color: "hsl(var(--muted-foreground))" }}>
              <span className="size-1.5 rounded-full" style={{ background: fillColor(ms.avgFill) }} /> {m}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Real 3D xarita + markerlar */}
        <div className="lg:col-span-2">
          <ObodRealMap
            accent={ACCENT}
            height={360}
            bare
            range={950}
            markers={markers}
            label={`${mahalla} — chiqindi qutilari & mashina`}
            legend={[
              { label: "Bo'sh", color: "#22c55e" },
              { label: "To'lyapti", color: "#84cc16" },
              { label: "To'lay deb qoldi", color: "#f59e0b" },
              { label: "To'la", color: "#ef4444" },
              { label: "Mashina", color: ts.color },
            ]}
          />
        </div>

        {/* Yon panel — quti ro'yxati (to'lganlik %) */}
        <div className="flex flex-col rounded-xl border border-[rgb(var(--card-border))] bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
              <Trash2 className="size-3.5" style={{ color: ACCENT }} /> {mahalla} — 10 ta quti
            </span>
            <span className="text-[11px] text-foreground/55">O'rtacha: <b style={{ color: fillColor(stat.avgFill) }}>{stat.avgFill}%</b></span>
          </div>

          <div className="flex-1 space-y-1.5 overflow-auto">
            {[...current.bins].sort((a, b) => b.fill - a.fill).map((b) => {
              const c = BIN_STATUS[b.status].color;
              return (
                <div key={b.id} className="flex items-center gap-2 text-[11px]">
                  <span className="w-24 shrink-0 truncate text-foreground/70">{b.street}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/5">
                    <div className="h-full rounded-full" style={{ width: `${b.fill}%`, background: c }} />
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono tabular-nums" style={{ color: c }}>{b.fill}%</span>
                  {b.status === "full" && <AlertTriangle className="size-3 shrink-0 text-rose-500" />}
                </div>
              );
            })}
          </div>

          {/* Mashina — kelgan/ketgan vaqt + hozir qayerda */}
          <div className="mt-2 rounded-lg border px-2.5 py-2"
            style={{ borderColor: hexA(ts.color, 0.3), background: hexA(ts.color, 0.06) }}>
            <div className="flex items-center gap-2">
              <Truck className="size-4" style={{ color: ts.color }} />
              <b className="font-mono text-[12px] text-foreground">{truck.plate}</b>
              <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: hexA(ts.color, 0.18), color: ts.color }}>{ts.label}</span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <LogIn className="size-3.5 text-emerald-500" />
                <div className="leading-tight">
                  <div className="text-[9px] text-foreground/45">Kelgan</div>
                  <div className="font-mono text-[13px] font-bold tabular-nums text-foreground">{truck.arrivedClock}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <LogOut className="size-3.5 text-rose-500" />
                <div className="leading-tight">
                  <div className="text-[9px] text-foreground/45">Ketgan</div>
                  <div className="font-mono text-[13px] font-bold tabular-nums text-foreground">
                    {truck.departedClock || <span className="text-amber-500">hali joyda</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 border-t pt-1.5 text-[10.5px] text-foreground/65" style={{ borderColor: hexA(ts.color, 0.2) }}>
              <MapPin className="size-3" style={{ color: ts.color }} />
              Hozir: <b className="text-foreground/80">{ts.live ? `${mahalla} mahallasida (xaritada)` : "Garaj / bazada"}</b>
              {ts.live && <span className="text-foreground/45">· {truck.speed} km/s</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AxlatBinsMap;
