// Dual glowing spline-area (tushum + arizalar) with hover guide + value chips.
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART, useChartTheme } from "./chartTheme";

const ChipTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const get = (k) => payload.find((p) => p.dataKey === k)?.value ?? 0;
  return (
    <div className="rounded-xl border border-[rgb(var(--card-border))] bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="mb-1.5 font-medium text-foreground/60">{label}</p>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple/15 px-2 py-0.5 font-semibold text-brand-purple tabular-nums">
          <span className="size-1.5 rounded-full bg-brand-purple" />
          {get("tushum").toLocaleString("uz-UZ")} mln
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow/15 px-2 py-0.5 font-semibold text-brand-yellow tabular-nums">
          <span className="size-1.5 rounded-full bg-brand-yellow" />
          {get("arizalar").toLocaleString("uz-UZ")} ariza
        </span>
      </div>
    </div>
  );
};

const SplineAreaChart = ({ data = [], height = 280 }) => {
  const t = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="splinePurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART.purple} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART.purple} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="splineYellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART.yellowLight} stopOpacity={0.25} />
            <stop offset="100%" stopColor={CHART.yellowLight} stopOpacity={0} />
          </linearGradient>
          <filter id="splineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: t.axis }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: t.axis }} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
        <Tooltip
          content={<ChipTooltip />}
          cursor={{ stroke: t.axis, strokeDasharray: "4 4", strokeOpacity: 0.5 }}
        />

        <Area
          type="monotone"
          dataKey="tushum"
          stroke={CHART.purpleLight}
          strokeWidth={2.5}
          fill="url(#splinePurple)"
          filter="url(#splineGlow)"
          dot={false}
          activeDot={{ r: 4, fill: CHART.purpleLight, stroke: t.tooltipBg, strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="arizalar"
          stroke={CHART.yellowLight}
          strokeWidth={2.5}
          fill="url(#splineYellow)"
          dot={false}
          activeDot={{ r: 4, fill: CHART.yellowLight, stroke: t.tooltipBg, strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SplineAreaChart;
