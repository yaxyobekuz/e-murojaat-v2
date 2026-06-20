import { useMemo } from "react";
import EChart from "./EChart";

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 3D "shahar bloklari" xaritasi — echarts-gl bar3D. Balandlik = faollik.
export function Map3DChart({ height = 360, seed = 1234, hotspots = 3 }) {
  const option = useMemo(() => {
    const rnd = mulberry32(seed);
    const N = 12;
    const data = [];
    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N; y++) {
        if (x % 4 === 0 || y % 4 === 0) {
          data.push({ value: [x, y, 0.2] });
          continue;
        }
        const h = 1 + Math.round(rnd() * 8);
        data.push({ value: [x, y, h] });
      }
    }
    for (let i = 0; i < hotspots; i++) {
      const x = 1 + Math.floor(rnd() * (N - 2));
      const y = 1 + Math.floor(rnd() * (N - 2));
      data.push({ value: [x, y, 12 + Math.round(rnd() * 4)], itemStyle: { color: "#fb7185" } });
    }
    return {
      tooltip: { show: false },
      visualMap: {
        show: false,
        min: 0,
        max: 14,
        dimension: 2,
        inRange: { color: ["#0e1830", "#1e3a8a", "#3b82f6", "#22d3ee", "#fbbf24"] },
      },
      xAxis3D: { type: "value", show: false },
      yAxis3D: { type: "value", show: false },
      zAxis3D: { type: "value", show: false, max: 16 },
      grid3D: {
        boxWidth: 100,
        boxDepth: 100,
        boxHeight: 40,
        show: false,
        viewControl: { autoRotate: true, autoRotateSpeed: 7, distance: 165, alpha: 32, beta: 30 },
        light: { main: { intensity: 1.2, shadow: true, shadowQuality: "medium" }, ambient: { intensity: 0.4 } },
        postEffect: { enable: true, bloom: { enable: true, intensity: 0.1 } },
        environment: "transparent",
      },
      series: [
        {
          type: "bar3D",
          data,
          shading: "lambert",
          bevelSize: 0.15,
          minHeight: 0.2,
          itemStyle: { opacity: 0.95 },
          label: { show: false },
          emphasis: { label: { show: false } },
        },
      ],
    };
  }, [seed, hotspots]);

  return <EChart option={option} height={height} />;
}

export default Map3DChart;
