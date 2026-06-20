// Theme-aware chart palette. Hook reads next-themes; colors used by all yer charts.
import { useTheme } from "next-themes";

export const CHART = {
  purple: "#8b5cf6",
  purpleLight: "#b794f6",
  yellow: "#eab308",
  yellowLight: "#f6e05e",
  cyan: "#22d3ee",
  emerald: "#10b981",
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
