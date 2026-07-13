// Chap panel — yuqorida 2×2 kamera kuzatuvi (demo video), pastida jonli operativ ko'rsatkichlar.
// O'ng paneldagi surface-overlay uslubining "teskari" varianti.
import { useRef } from "react";
import { Radio, Maximize2, MessageSquare, Siren, ClipboardList, GraduationCap, Car, UserSearch, TrendingUp, TrendingDown } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { CAMERAS, LIVE_FEEDS } from "../data/mahallaData";

const FEED_ICON = { MessageSquare, Siren, ClipboardList, GraduationCap, Car, UserSearch };
const TONE = {
  info: { text: "text-cyan-400", ring: "ring-cyan-500/20", bg: "bg-cyan-500/10" },
  success: { text: "text-emerald-400", ring: "ring-emerald-500/20", bg: "bg-emerald-500/10" },
  warning: { text: "text-amber-400", ring: "ring-amber-500/20", bg: "bg-amber-500/10" },
  danger: { text: "text-red-400", ring: "ring-red-500/20", bg: "bg-red-500/10" },
};

function CameraTile({ cam }) {
  const ref = useRef(null);
  return (
    <div className="group relative aspect-video overflow-hidden rounded-lg border border-[rgb(var(--card-border))] bg-black">
      <video
        ref={ref}
        src={cam.src}
        autoPlay
        muted
        loop
        playsInline
        className="size-full object-cover opacity-90"
      />
      {/* LIVE belgisi */}
      <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 backdrop-blur-sm">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
          <span className="relative inline-flex size-1.5 rounded-full bg-red-500" />
        </span>
        <span className="text-[8px] font-bold tracking-wide text-white/90">LIVE</span>
      </div>
      {/* ko'cha nomi */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 pb-1 pt-3">
        <p className="truncate text-[9px] font-medium text-white/90">{cam.label}</p>
      </div>
      <button
        type="button"
        onClick={() => ref.current?.requestFullscreen?.()}
        className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded bg-black/55 text-white/70 opacity-0 backdrop-blur-sm transition-opacity hover:text-white group-hover:opacity-100"
        title="To'liq ekran"
      >
        <Maximize2 className="size-3" />
      </button>
    </div>
  );
}

function FeedRow({ feed }) {
  const Icon = FEED_ICON[feed.icon] || MessageSquare;
  const t = TONE[feed.tone] || TONE.info;
  const Delta = feed.delta > 0 ? TrendingUp : TrendingDown;
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-[rgb(var(--card-border))] bg-card/40 px-2.5 py-2">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg ring-1", t.bg, t.ring)}>
        <Icon className={cn("size-4", t.text)} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium leading-tight text-foreground/80">{feed.label}</p>
        {feed.sub && <p className="truncate text-[9px] text-foreground/40">{feed.sub}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end">
        <span className={cn("text-[17px] font-bold leading-none tabular-nums", t.text)}>{feed.value}</span>
        {feed.delta !== 0 && (
          <span className={cn("mt-0.5 flex items-center gap-0.5 text-[8.5px] tabular-nums", feed.delta > 0 ? "text-emerald-400/80" : "text-red-400/80")}>
            <Delta className="size-2.5" /> {Math.abs(feed.delta)}
          </span>
        )}
      </div>
    </div>
  );
}

const LeftBar = ({ feeds = LIVE_FEEDS }) => {
  return (
    <div className="surface-overlay flex h-full flex-col overflow-hidden rounded-2xl p-3 shadow-2xl backdrop-blur-xl">
      {/* ===== Kamera kuzatuvi (2×2) ===== */}
      <div className="mb-2 flex items-center gap-1.5 px-0.5">
        <Radio className="size-3.5 text-cyan-400" />
        <p className="text-[11px] font-semibold">Kamera kuzatuvi</p>
        <span className="ml-auto text-[9px] text-foreground/40">{CAMERAS.length} kamera</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {CAMERAS.map((c) => (
          <CameraTile key={c.id} cam={c} />
        ))}
      </div>

      {/* ===== Jonli operativ ko'rsatkichlar ===== */}
      <div className="mb-2 mt-3 flex items-center gap-1.5 px-0.5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
        <p className="text-[11px] font-semibold">Jonli operativ holat</p>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5">
        {feeds.map((feed) => (
          <FeedRow key={feed.key} feed={feed} />
        ))}
      </div>
    </div>
  );
};

export default LeftBar;
