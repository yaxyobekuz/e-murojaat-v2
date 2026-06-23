// Bottom overlay: building height color ramp + live count of visible buildings.
import { HEIGHT_RAMP } from "./mapConfig";

const gradient = `linear-gradient(90deg, ${HEIGHT_RAMP.map((s) => s.color).join(", ")})`;

const MapLegend = ({ visibleCount }) => (
  <div className="surface absolute bottom-4 left-4 z-10 flex flex-col gap-2 p-3">
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-foreground/60">Bino balandligi</span>
      <span className="h-2 w-44 rounded-full" style={{ background: gradient }} />
      <div className="flex justify-between text-[10px] text-foreground/45">
        <span>Past (~3 m)</span>
        <span>Baland (50+ m)</span>
      </div>
    </div>
    <div className="border-t border-[rgb(var(--card-border))] pt-2 text-[11px] text-foreground/60">
      Ko'rinayotgan obyektlar:{" "}
      <b className="tabular-nums text-foreground">{visibleCount ?? "—"}</b>
    </div>
  </div>
);

export default MapLegend;
