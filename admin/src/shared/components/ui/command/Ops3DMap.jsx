// Sarnovul MFY — HAQIQIY interaktiv 3D xarita. Kalit bo'lsa Google Maps photorealistik
// 3D (real footage, tilt/rotate/zoom). Bo'lmasa — echarts-gl 3D binolar sahnasi:
// sichqoncha bilan AYLANTIRISH (drag) + ZOOM (scroll). Binolar — asosiy detal.
import { useMemo } from "react";

import { EChart } from "@/shared/components/ui/chart3d/EChart";
import { Mahalla3DMap } from "@/shared/components/ui/chart3d/Mahalla3DMap";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const CENTER = { lat: 40.9034, lng: 71.8604 }; // Sarnovul MFY, Baliqchi, Andijon

// Binolar (asosiy detal): x,z grid pozitsiyasi, balandlik (qavat), rang, nom
const KEY_BUILDINGS = [
  { x: 5, z: 5, h: 14, name: "Shifoxona", color: "#ef4444" },
  { x: 8, z: 4, h: 10, name: "41-maktab", color: "#3b82f6" },
  { x: 3, z: 7, h: 7, name: "Bog'cha", color: "#22c55e" },
  { x: 6, z: 8, h: 12, name: "Bozor", color: "#f59e0b" },
  { x: 9, z: 7, h: 9, name: "Savdo markazi", color: "#fb923c" },
  { x: 4, z: 3, h: 16, name: "TJM-12", color: "#06b6d4" },
  { x: 7, z: 6, h: 6, name: "Gaz shoxobcha", color: "#dc2626" },
  { x: 2, z: 5, h: 8, name: "Masjid", color: "#14b8a6" },
];

const Ops3DMap = ({ height = 420 }) => {
  const option = useMemo(() => {
    const N = 11;
    const data = [];
    // ko'cha/zamin kataklari
    for (let x = 0; x < N; x++)
      for (let z = 0; z < N; z++) {
        const onRoad = x % 5 === 0 || z % 5 === 0;
        if (onRoad) { data.push({ value: [x, z, 0.25], itemStyle: { color: "#16233f" } }); continue; }
        // turar-joy bloklari (past, ko'k)
        const h = 2 + ((x * 7 + z * 13) % 6);
        data.push({ value: [x, z, h], itemStyle: { color: "#1f3a5f" } });
      }
    // asosiy binolar (baland, rangli, nomli)
    KEY_BUILDINGS.forEach((b) => data.push({ value: [b.x, b.z, b.h], name: b.name, itemStyle: { color: b.color } }));

    return {
      tooltip: { show: true, formatter: (p) => (p.name ? `<b>${p.name}</b><br/>${p.value[2]} qavat` : ""), backgroundColor: "#0a1020", borderColor: "#f59e0b", textStyle: { color: "#fff", fontSize: 11 } },
      visualMap: { show: false, min: 0, max: 18, dimension: 2, inRange: { color: ["#16233f", "#1f3a5f", "#2563eb", "#22d3ee", "#f59e0b"] } },
      xAxis3D: { type: "value", show: false, max: N },
      yAxis3D: { type: "value", show: false, max: N },
      zAxis3D: { type: "value", show: false, max: 18 },
      grid3D: {
        boxWidth: 120, boxDepth: 120, boxHeight: 46, show: false,
        viewControl: { projection: "perspective", autoRotate: true, autoRotateSpeed: 6, autoRotateAfterStill: 3, distance: 175, alpha: 36, beta: 28, rotateSensitivity: 1.4, zoomSensitivity: 1.4, minDistance: 80, maxDistance: 320 },
        light: { main: { intensity: 1.25, shadow: true, shadowQuality: "high", alpha: 40, beta: 40 }, ambient: { intensity: 0.45 } },
        postEffect: { enable: true, bloom: { enable: true, intensity: 0.12 }, SSAO: { enable: true, radius: 2 } },
        environment: "#070d1a",
      },
      series: [{
        type: "bar3D", shading: "realistic", bevelSize: 0.35, bevelSmoothness: 2, data,
        emphasis: { label: { show: true, formatter: "{b}", textStyle: { color: "#fff", fontSize: 12, backgroundColor: "rgba(0,0,0,0.6)", padding: 3, borderRadius: 3 } } },
        label: { show: false },
      }],
    };
  }, []);

  // Kalit bo'lsa — haqiqiy Google Maps 3D footage
  if (API_KEY && API_KEY !== "your_google_maps_api_key_here") {
    return (
      <Mahalla3DMap
        center={CENTER}
        height={height}
        markers={KEY_BUILDINGS.map((b, i) => ({
          lat: CENTER.lat + (b.z - 5) * 0.0006,
          lng: CENTER.lng + (b.x - 5) * 0.0007,
          label: b.name,
          status: `${b.h} qavat`,
        }))}
      />
    );
  }
  return <EChart option={option} height={height} />;
};

export default Ops3DMap;
