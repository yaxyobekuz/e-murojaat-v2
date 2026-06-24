// Elektr moduli grafik palitrasi (energiya ohangida) — theme-aware.
import { useTheme } from "next-themes";

export const E = {
  amber: "#f59e0b",
  amberLight: "#fcd34d",
  emerald: "#10b981",
  emeraldLight: "#6ee7b7",
  red: "#ef4444",
  slate: "#64748b",
  cyan: "#22d3ee",
};

export const useChartTheme = () => {
  const { theme } = useTheme();
  const dark = theme !== "light";
  return {
    dark,
    axis: dark ? "#71717a" : "#94a3b8",
    grid: dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
    tooltipBg: dark ? "#18181b" : "#ffffff",
    tooltipBorder: dark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)",
    text: dark ? "#e4e4e7" : "#0f172a",
  };
};
