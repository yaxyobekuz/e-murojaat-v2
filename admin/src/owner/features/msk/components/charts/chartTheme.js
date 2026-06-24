// MSK grafik palitrasi (rose accent) — theme-aware.
import { useTheme } from "next-themes";

export const M = {
  rose: "#f43f5e",
  roseLight: "#fb7185",
  sky: "#0ea5e9",
  amber: "#f59e0b",
  emerald: "#10b981",
  violet: "#8b5cf6",
  slate: "#64748b",
};

export const CAT_PALETTE = [
  "#f43f5e", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4",
  "#ec4899", "#84cc16", "#fb923c", "#14b8a6", "#a855f7", "#ef4444",
];

export const useChartTheme = () => {
  const { theme } = useTheme();
  const dark = theme !== "light";
  return {
    dark,
    axis: dark ? "#71717a" : "#94a3b8",
    grid: dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
    tooltipBg: dark ? "#18181b" : "#ffffff",
    text: dark ? "#e4e4e7" : "#0f172a",
  };
};
