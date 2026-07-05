import { useState } from "react";
import { PlugZap, Sun, TriangleAlert, Zap } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import StackedBar from "@/shared/components/ui/chart/StackedBar";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import SectionTitle from "./SectionTitle";
import { ELEKTR } from "../data/sarnovul.data";

const SEGMENTS = ["Quyosh generatsiyasi", "Texnik yo'qotish"];

const ElektrSection = () => {
  const [segment, setSegment] = useState(SEGMENTS[0]);
  const solarActive = segment === SEGMENTS[0];

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle
        icon={Zap}
        tone="amber"
        title="Elektr energiya"
        subtitle="Oylik iste'mol manbalari, quyosh generatsiyasi va texnik yo'qotish"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GlassStatCard
          label="Oylik iste'mol (iyun)"
          value={ELEKTR.monthlyTotal}
          suffix=" kVt·soat"
          icon={Zap}
          accent="yellow"
          delta={ELEKTR.deltas.total}
          glow
        />
        <GlassStatCard
          label={`TP (tarmoq) orqali — ${(100 - ELEKTR.solarShare).toLocaleString("uz-UZ")}%`}
          value={ELEKTR.fromGrid}
          suffix=" kVt·soat"
          icon={PlugZap}
          accent="purple"
        />
        <GlassStatCard
          label={`Quyosh panellaridan — ${ELEKTR.solarShare.toLocaleString("uz-UZ")}% (${ELEKTR.solarHomes} xonadon)`}
          value={ELEKTR.fromSolar}
          suffix=" kVt·soat"
          icon={Sun}
          accent="emerald"
          delta={ELEKTR.deltas.solar}
        />
        <GlassStatCard
          label={`Texnik yo'qotish — ${ELEKTR.lossPct.toLocaleString("uz-UZ")}%`}
          value={ELEKTR.lossKwh}
          suffix=" kVt·soat"
          icon={TriangleAlert}
          accent="cyan"
          delta={ELEKTR.deltas.loss}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassChartCard
          title="Iste'mol manbalari (12 oy)"
          insight={`Iyunda iste'molning ${ELEKTR.solarShare.toLocaleString("uz-UZ")}% i quyosh panellaridan qoplandi`}
        >
          <StackedBar
            data={ELEKTR.sources}
            series={[
              { key: "tp", label: "TP (tarmoq)", color: "#8b5cf6" },
              { key: "solar", label: "Quyosh panellari", color: "#f59e0b" },
            ]}
            unit="kVt·soat"
            height={280}
          />
        </GlassChartCard>

        <GlassChartCard
          title={solarActive ? "Quyosh panellari ishlab chiqargan quvvat" : "Texnik yo'qotish dinamikasi"}
          insight={
            solarActive
              ? `Iyunda ${ELEKTR.solarGenerated.toLocaleString("uz-UZ")} kVt·soat — yillik o'sish +${ELEKTR.deltas.generated.toLocaleString("uz-UZ")}%`
              : `Bir yilda 10,2% dan ${ELEKTR.lossPct.toLocaleString("uz-UZ")}% ga tushdi`
          }
          segments={SEGMENTS}
          active={segment}
          onSegment={setSegment}
        >
          <TrendChart
            data={solarActive ? ELEKTR.solarGenSeries : ELEKTR.lossSeries}
            color={solarActive ? "#f59e0b" : "#ef4444"}
            unit={solarActive ? "kVt·soat" : "%"}
            height={280}
          />
        </GlassChartCard>
      </div>
    </div>
  );
};

export default ElektrSection;
