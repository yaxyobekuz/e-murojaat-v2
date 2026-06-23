// Radar — mahalla (yoki umumiy) yoshlar profili: bandlik/ta'lim/IT/tadbirkorlik/til/salohiyat.
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const YouthRadar = ({ data, color = "#06b6d4", height = 240 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <RadarChart data={data} outerRadius="72%">
      <PolarGrid stroke="rgba(255,255,255,0.12)" />
      <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} />
      <Radar dataKey="value" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.28} />
    </RadarChart>
  </ResponsiveContainer>
);

export default YouthRadar;
