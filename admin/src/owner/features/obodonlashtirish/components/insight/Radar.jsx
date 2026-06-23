// Survival radar (EChart) — tur bo'yicha tirik qolish ko'rsatkichi.
import { useMemo } from "react";

import { EChart } from "@/shared/components/ui/chart3d/EChart";
import { hexA } from "@/shared/components/ui/command/primitives";

export const SurvivalRadar = ({ data, accent, height = 240 }) => {
  const option = useMemo(() => ({
    tooltip: { backgroundColor: "#16161a", borderColor: hexA(accent, 0.4), textStyle: { color: "#fff", fontSize: 11 } },
    radar: {
      indicator: data.map((d) => ({ name: d.axis, max: 100 })),
      radius: "66%",
      axisName: { color: "rgba(255,255,255,0.6)", fontSize: 10 },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      splitArea: { areaStyle: { color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.04)"] } },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
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
