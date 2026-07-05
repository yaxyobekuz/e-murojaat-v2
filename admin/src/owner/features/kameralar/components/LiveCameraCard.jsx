// Bitta kameraning jonli (live) kartasi — go2rtc embed player (iframe, WebRTC).
import { Trash2, Wifi, WifiOff } from "lucide-react";
import { useCameraStatus, useRemoveCamera } from "../hooks/useCameras";

const LiveCameraCard = ({ cam }) => {
  const { data } = useCameraStatus(cam.id);
  const remove = useRemoveCamera();
  const online = data?.online;

  return (
    <div className="surface overflow-hidden p-0">
      {/* Jonli tasvir — go2rtc WebRTC player (kam kechikish) */}
      <div className="relative aspect-video bg-black">
        <iframe
          title={cam.name}
          src={cam.stream.embed}
          allow="autoplay; fullscreen"
          className="absolute inset-0 size-full border-0"
        />
        <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
          <span className="size-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />REC
        </div>
      </div>
      {/* Pastki panel: nomi, holati, o'chirish */}
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{cam.name}</div>
          <div className="truncate text-xs text-foreground/45">{cam.location} · {cam.ip}:{cam.port}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${online ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
            {online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
            {online ? "Online" : "Offline"}
          </span>
          <button
            onClick={() => remove.mutate(cam.id)}
            disabled={remove.isPending}
            title="Kamerani o'chirish"
            className="grid size-8 place-items-center rounded-lg border border-[rgb(var(--card-border))] text-foreground/60 transition-colors hover:border-red-500/50 hover:text-red-400"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveCameraCard;
