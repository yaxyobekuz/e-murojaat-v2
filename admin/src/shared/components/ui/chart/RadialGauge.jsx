// Reusable radial progress gauge — value: 0..100, animated stroke + count-up.
import { useEffect, useState } from "react";
import { useCountUp } from "@/shared/components/ui/counter/AnimatedCounter";

const RadialGauge = ({
  value = 0,
  size = 148,
  stroke = 11,
  color = "#1E4FD8",
  label,
  sublabel,
  suffix = "%",
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  const shown = useCountUp(value, 1200);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setOffset(circ - (Math.min(Math.max(value, 0), 100) / 100) * circ),
    );
    return () => cancelAnimationFrame(id);
  }, [value, circ]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(148,163,184,0.18)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-2xl font-semibold tabular-nums">
              {shown}
              {suffix}
            </div>
            {label && <div className="mt-0.5 text-[11px] text-foreground/55">{label}</div>}
          </div>
        </div>
      </div>
      {sublabel && <p className="max-w-[180px] text-center text-xs text-foreground/45">{sublabel}</p>}
    </div>
  );
};

export default RadialGauge;
