import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "echarts-gl";

// Generic ECharts (with GL/3D) wrapper. WebGL bo'lmasa app qulamaydi.
export function EChart({ option, height = 320, className = "" }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    let chart = null;
    try {
      chart = echarts.init(ref.current, null, { renderer: "canvas" });
      chart.setOption(option);
    } catch (err) {
      console.warn("EChart render failed (WebGL?).", err);
      setFailed(true);
      try {
        chart?.dispose();
      } catch {
        /* ignore */
      }
      return;
    }
    chartRef.current = chart;
    const onResize = () => {
      try {
        chart?.resize();
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      try {
        chart?.dispose();
      } catch {
        /* ignore */
      }
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    try {
      chartRef.current.setOption(option, true);
    } catch {
      /* ignore */
    }
  }, [option]);

  if (failed) {
    return (
      <div
        style={{ height }}
        className={`flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-xs text-foreground/50 ${className}`}
      >
        3D grafik — brauzerda (WebGL) ko'rinadi
      </div>
    );
  }
  return <div ref={ref} style={{ height }} className={className} />;
}

export default EChart;
