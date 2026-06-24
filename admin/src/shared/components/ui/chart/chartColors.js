// Theme-aware ranglar — barcha shared recharts grafiklarida ishlatiladi.
// Light mode rangları o'zgarmaydi; dark mode'da o'q/grid/tooltip kontrast bo'ladi.
import { useTheme } from "next-themes";

export const useChartColors = () => {
  const { theme } = useTheme();
  const dark = theme !== "light";
  const text = dark ? "#e4e4e7" : "#18181b";
  const border = dark ? "rgba(255,255,255,0.12)" : "#e4e4e7";
  const bg = dark ? "#18181b" : "#ffffff";
  return {
    dark,
    axis: dark ? "#a1a1aa" : "#71717a",
    axisStrong: dark ? "#d4d4d8" : "#3f3f46",
    grid: dark ? "rgba(255,255,255,0.08)" : "#eef0f3",
    cursor: dark ? "rgba(255,255,255,0.06)" : "#f4f4f5",
    legend: dark ? "#a1a1aa" : "#52525b",
    tooltip: { borderRadius: 8, border: `1px solid ${border}`, background: bg, color: text, fontSize: 12 },
    tooltipLabel: { color: text },
  };
};
