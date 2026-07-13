// Pastki panel — qo'shimcha ko'rsatkichlar + jonli soat + "jonli" indikator + boshqaruv.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio, LayoutGrid } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import ThemeToggle from "@/shared/components/ui/theme/ThemeToggle";
import { BOTTOM_STATS } from "../data/mahallaData";

const TONE = {
  success: "text-emerald-400",
  warning: "text-amber-400",
  danger: "text-red-400",
  info: "text-cyan-400",
};
const pad = (n) => String(n).padStart(2, "0");

function useClock() {
  const [s, setS] = useState("");
  useEffect(() => {
    const f = () => {
      const d = new Date();
      setS(`${pad(d.getHours())}:${pad(d .getMinutes())}:${pad(d.getSeconds())}`);
    };
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return s;
}

const BottomBar = ({ stats = BOTTOM_STATS }) => {
  const clk = useClock();
  const nav = useNavigate();
  return (
    <div className="surface-overlay flex items-center gap-2 overflow-x-auto rounded-xl px-3 py-2 backdrop-blur-md">
      <button
        type="button"
        onClick={() => nav("/owner/sarnovul")}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[rgb(var(--card-border))] px-2.5 py-1 text-[11px] font-medium text-foreground/70 transition-colors hover:text-foreground"
      >
        <LayoutGrid className="size-3.5" /> Modullar
      </button>
      <ThemeToggle className="size-7" />

      <div className="h-5 w-px shrink-0 bg-white/10" />

      <div className="flex shrink-0 items-center gap-1.5 pr-2 text-[11px] font-semibold text-emerald-400">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
        <Radio className="size-3.5" /> Jonli
      </div>

      <div className="h-5 w-px shrink-0 bg-white/10" />

      <div className="flex flex-1 items-center gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px]">
            <span className="text-foreground/45">{s.label}:</span>
            <span className={cn("font-semibold tabular-nums", TONE[s.tone])}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="h-5 w-px shrink-0 bg-white/10" />
      <div className="shrink-0 font-mono text-[12px] font-semibold tabular-nums text-foreground/70">{clk}</div>
    </div>
  );
};

export default BottomBar;
