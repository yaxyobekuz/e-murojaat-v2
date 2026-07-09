// Bitta kameraning jonli (live) kartasi — WebRTC + AI obyekt aniqlash (motion tracking).
// WebRTC ulanmasa iframe player'ga (AIsiz) tushadi.
import { useState } from "react";
import { Trash2, Wifi, WifiOff, ScanEye } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import AiCameraFeed from "@/shared/components/ai/AiCameraFeed";
import { useGo2rtcStream } from "@/shared/lib/go2rtcWebrtc";
import { useCameraStatus, useRemoveCamera } from "../hooks/useCameras";

const LiveCameraCard = ({ cam }) => {
  const { data } = useCameraStatus(cam.id);
  const remove = useRemoveCamera();
  const [ai, setAi] = useState(true);
  const { stream, error } = useGo2rtcStream(cam.stream.webrtc);
  const online = data?.online;

  return (
    <div className="surface overflow-hidden p-0">
      <div className="relative aspect-video bg-black">
        {stream ? (
          <AiCameraFeed stream={stream} ai={ai} className="absolute inset-0 size-full" />
        ) : error ? (
          // WebRTC bo'lmasa — iframe player (AIsiz)
          <iframe title={cam.name} src={cam.stream.embed} allow="autoplay; fullscreen" className="absolute inset-0 size-full border-0" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs text-foreground/40">Ulanmoqda…</div>
        )}
        <div className="pointer-events-none absolute left-2 top-2 z-10 hidden items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-red-400">● REC</div>
        <button onClick={() => setAi((a) => !a)} title="AI aniqlashni yoqish/o'chirish" className={cn("absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition-colors", ai ? "bg-brand-cyan/25 text-brand-cyan" : "bg-black/55 text-white/70")}>
          <ScanEye className="size-3" /> AI
        </button>
      </div>

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
          <button onClick={() => remove.mutate(cam.id)} disabled={remove.isPending} title="Kamerani o'chirish" className="grid size-8 place-items-center rounded-lg border border-[rgb(var(--card-border))] text-foreground/60 transition-colors hover:border-red-500/50 hover:text-red-400">
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveCameraCard;
