// Blok tanlanganda — o'sha blokdagi kamera yozuvlari (footage) paneli.
// Demo: stilizatsiya qilingan "jonli efir" kadrlari (vaqt belgisi + REC/LIVE + skanlayn).
import { X, Video, VideoOff, Circle, Clock, Film, Play, ShieldAlert } from "lucide-react";

import { SECURITY_STATUS, INCIDENT_TYPES } from "../../mock/iib.mapAreas";

const CameraTile = ({ cam }) => (
  <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
    <div className="relative aspect-video w-full">
      {cam.online ? (
        <>
          {/* "jonli efir" foni */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0b1220_0%,#111827_50%,#0a0f1a_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <Play className="size-7 text-white/30" />
          </div>
          {/* REC indikatori */}
          <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5">
            <Circle className="size-2 animate-pulse fill-rose-500 text-rose-500" />
            <span className="text-[9px] font-semibold tracking-wide text-rose-300">REC</span>
          </div>
          {/* vaqt belgisi */}
          <div className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300">
            {cam.lastEvent}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-zinc-900">
          <div className="flex flex-col items-center gap-1 text-zinc-500">
            <VideoOff className="size-5" />
            <span className="text-[9px]">Signal yo'q</span>
          </div>
        </div>
      )}
    </div>
    <div className="flex items-center justify-between gap-2 px-2 py-1.5">
      <div className="min-w-0">
        <div className="flex items-center gap-1 truncate text-[11px] font-semibold text-white">
          {cam.online ? (
            <Video className="size-3 text-emerald-400" />
          ) : (
            <VideoOff className="size-3 text-zinc-500" />
          )}
          {cam.name}
        </div>
        <div className="truncate text-[10px] text-white/45">{cam.angle}</div>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-white/45">
        <Film className="size-3" />
        {cam.clips}
      </div>
    </div>
  </div>
);

const IibCameraPanel = ({ area, onClose }) => {
  if (!area) return null;
  const st = SECURITY_STATUS[area.status] || SECURITY_STATUS.calm;

  return (
    <div className="surface absolute right-4 top-4 z-30 flex max-h-[calc(100%-2rem)] w-80 flex-col p-3 shadow-2xl animate-in fade-in slide-in-from-right-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="grid size-8 place-items-center rounded-lg"
            style={{ backgroundColor: `${st.color}26`, color: st.color }}
          >
            <Video className="size-4" />
          </span>
          <div className="leading-tight">
            <h4 className="text-sm font-semibold">{area.name}</h4>
            <p className="text-[11px] text-foreground/50">
              {area.code} · {area.info.camerasOnline}/{area.info.cameras} kamera onlayn
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className="grid size-6 shrink-0 place-items-center rounded-md text-foreground/50 hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Hodisalar ro'yxati */}
      {area.incidents.length > 0 && (
        <div className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/5 p-2">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-300">
            <ShieldAlert className="size-3.5" /> Faol hodisalar ({area.incidents.length})
          </div>
          <div className="flex flex-col gap-1.5">
            {area.incidents.map((inc) => {
              const t = INCIDENT_TYPES[inc.type];
              return (
                <div key={inc.id} className="flex items-start gap-2">
                  <span
                    className="mt-1 size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: t?.color || "#ef4444" }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11.5px] text-white/90">{inc.title}</div>
                    <div className="flex items-center gap-1 text-[10px] text-white/40">
                      <Clock className="size-2.5" /> {inc.time}
                      {inc.plate && (
                        <span className="ml-1 rounded bg-white/10 px-1 font-mono text-[9.5px] text-white/70">
                          {inc.plate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kamera yozuvlari */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-foreground/70">Kamera yozuvlari</span>
        <span className="text-[10px] text-foreground/40">jonli efir</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 overflow-y-auto pr-0.5">
        {area.cameras.map((cam) => (
          <CameraTile key={cam.id} cam={cam} />
        ))}
      </div>
    </div>
  );
};

export default IibCameraPanel;
