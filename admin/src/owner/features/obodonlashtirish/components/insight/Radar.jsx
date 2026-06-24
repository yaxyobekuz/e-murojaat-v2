// Survival radar (EChart) — tur bo'yicha tirik qolish ko'rsatkichi.
import { useMemo } from "react";

import { EChart } from "@/shared/components/ui/chart3d/EChart";
import { hexA } from "@/shared/components/ui/command/primitives";

export const SurvivalRadar = ({ data, accent, height = 240 }) => {
  const option = useMemo(() => ({
    tooltip: { backgroundColor: "hsl(var(--popover))", borderColor: hexA(accent, 0.4), textStyle: { color: "hsl(var(--popover-foreground))", fontSize: 11 } },
    radar: {
      indicator: data.map((d) => ({ name: d.axis, max: 100 })),
      radius: "66%",
      axisName: { color: "hsl(var(--muted-foreground))", fontSize: 10 },
      splitLine: { lineStyle: { color: "rgb(var(--card-border))" } },
      splitArea: { areaStyle: { color: ["hsl(var(--foreground) / 0.03)", "hsl(var(--foreground) / 0.05)"] } },
      axisLine: { lineStyle: { color: "rgb(var(--card-border))" } },
    },
    series: [{
      type: "radar",
      data: [{
        value: data.map((d) => d.value),
        name: "Tirik qolish %",
        symbol: "circle", symbolSize: 5,
        lineStyle: { color: accent, width: 2 },
        itemStyle: { color: accent },
        areaStyle: { color: hexA(accent, 0.25) },
      }],
    }],
  }), [data, accent]);
  return <EChart option={option} height={height} />;
};
