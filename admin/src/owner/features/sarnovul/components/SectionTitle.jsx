import { cn } from "@/shared/utils/cn";

const TONES = {
  amber: "bg-amber-500/15 text-amber-400",
  blue: "bg-blue-500/15 text-blue-400",
  cyan: "bg-cyan-500/15 text-cyan-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  purple: "bg-purple-500/15 text-purple-400",
  indigo: "bg-indigo-500/15 text-indigo-400",
  orange: "bg-orange-500/15 text-orange-400",
};

const SectionTitle = ({ icon: Icon, tone = "blue", title, subtitle }) => (
  <div className="flex items-center gap-3">
    <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", TONES[tone])}>
      <Icon className="size-5" strokeWidth={2} />
    </span>
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-[13px] text-foreground/50">{subtitle}</p>}
    </div>
  </div>
);

export default SectionTitle;
