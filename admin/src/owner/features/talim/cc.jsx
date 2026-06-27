// Ta'lim — umumiy command-center primitivlari (dark, glass, count-up, ECharts).
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as echarts from "echarts";

export const T = { bg: "#0A1119", panel: "#0F1A24", border: "#1E2D3D", gold: "#E0A93B", teal: "#2DD4BF", green: "#2FBF87", amber: "#E0A93B", red: "#E5484D", alarm: "#FF4D4D", text: "#E8EEF3", muted: "#7C8B99" };
export const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CSS = `
.tcc{--g:${T.gold};font-family:Inter,system-ui,sans-serif;color:${T.text};background:${T.bg};min-height:100%;position:relative;overflow:hidden}
.tcc::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(900px 500px at 18% -8%,rgba(224,169,59,.10),transparent 60%),radial-gradient(800px 600px at 95% 10%,rgba(45,212,191,.08),transparent 60%)}
.tcc::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:38px 38px;animation:tccGrid 40s linear infinite}
@keyframes tccGrid{to{background-position:38px 38px}}
.tcc h1,.tcc h2,.tcc h3,.tcc .ttl{font-family:"Space Grotesk",Inter,sans-serif}
.tcc .mono{font-family:"JetBrains Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}
.tcc *{box-sizing:border-box}
.tcc-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;padding:12px 20px;flex-wrap:wrap;background:rgba(10,17,25,.72);backdrop-filter:blur(12px);border-bottom:1px solid ${T.border};transform:translateY(-100%);animation:tccDrop .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tccDrop{to{transform:translateY(0)}}
.tcc-emb{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,${T.gold},#7a5414);display:grid;place-items:center;font-weight:800;color:#1a1205;font-family:"Space Grotesk";box-shadow:0 0 18px rgba(224,169,59,.4)}
.tcc-top .nm{font-weight:700;font-size:15px;font-family:"Space Grotesk"}.tcc-top .sb{font-size:11px;color:${T.muted}}
.tcc-sel{background:rgba(255,255,255,.05);color:${T.text};border:1px solid ${T.border};border-radius:8px;padding:6px 10px;font-size:12px}
.tcc-btn{background:rgba(255,255,255,.05);color:${T.text};border:1px solid ${T.border};border-radius:8px;padding:6px 12px;font-size:12.5px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.tcc-btn:hover{border-color:${T.gold}}
.tcc-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:${T.teal}}
.tcc-live i{width:7px;height:7px;border-radius:50%;background:${T.teal};box-shadow:0 0 8px ${T.teal};animation:tccPulse 1.4s ease-in-out infinite}
@keyframes tccPulse{50%{opacity:.3;transform:scale(.7)}}
.tcc-wrap{position:relative;z-index:1;padding:18px 20px;max-width:1560px;margin:0 auto}
.tcc-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
.tcc-card{background:linear-gradient(180deg,rgba(15,26,36,.82),rgba(12,21,30,.82));border:1px solid ${T.border};border-radius:16px;padding:14px 16px;box-shadow:0 1px 0 rgba(255,255,255,.03) inset,0 18px 40px -24px rgba(0,0,0,.9);backdrop-filter:blur(8px);display:flex;flex-direction:column;min-width:0;opacity:0;transform:translateY(16px);animation:tccUp .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tccUp{to{opacity:1;transform:translateY(0)}}
.tcc-card .hd{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:10px}
.tcc-card .hd .t{font-weight:700;font-size:13.5px;font-family:"Space Grotesk"}.tcc-card .hd .s{font-size:11px;color:${T.muted}}
.tcc-exp{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:28px;height:28px;display:grid;place-items:center;cursor:pointer;color:${T.muted};flex:0 0 auto}
.tcc-exp:hover{color:${T.text};border-color:${T.gold}}
.tcc-ch{width:100%;overflow:hidden;position:relative}
.tcc-note{font-size:11px;color:${T.muted};margin-top:8px}
.tcc-pill{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(224,169,59,.14);color:${T.gold}}
.tcc-hero{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:14px;margin-bottom:14px}
.tcc-alarm{background:radial-gradient(120% 120% at 30% 0%,rgba(255,77,77,.18),rgba(15,26,36,.85));border:1px solid rgba(255,77,77,.35);border-radius:18px;padding:16px 18px;overflow:hidden}
.tcc-alarm .big{font-family:"JetBrains Mono";font-size:64px;font-weight:700;line-height:1;color:${T.alarm};text-shadow:0 0 26px rgba(255,77,77,.6);animation:tccGlow 2.6s ease-in-out infinite}
@keyframes tccGlow{50%{text-shadow:0 0 40px rgba(255,77,77,.9)}}
.tcc-kpi{background:rgba(15,26,36,.8);border:1px solid ${T.border};border-radius:16px;padding:14px 16px}
.tcc-kpi .lab{font-size:11px;color:${T.muted};font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.tcc-kpi .val{font-family:"JetBrains Mono";font-size:30px;font-weight:700;margin-top:6px}
.tcc-h2{font-family:"Space Grotesk";font-size:17px;font-weight:700;margin:6px 0 14px;display:flex;align-items:center;gap:10px}
.tcc-h2::before{content:"";width:4px;height:18px;background:${T.gold};border-radius:2px;box-shadow:0 0 10px ${T.gold}}
.tcc-inst{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.tcc-instc{cursor:pointer;transition:transform .2s,box-shadow .2s,border-color .2s;animation:none;opacity:1;transform:none}
.tcc-instc:hover{transform:translateY(-5px);border-color:rgba(224,169,59,.55);box-shadow:0 26px 54px -22px rgba(224,169,59,.4)}
.tcc-filter{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px}
.tcc-inp{background:rgba(255,255,255,.05);border:1px solid ${T.border};border-radius:8px;color:${T.text};padding:7px 10px;font-size:12.5px;font-family:Inter;outline:none}
.tcc-inp:focus{border-color:${T.gold}}.tcc-inp::placeholder{color:${T.muted}}
.tcc-found{font-family:"JetBrains Mono";font-size:13px;color:${T.teal};font-weight:700}
.tcc-tbl{width:100%!important;min-width:0!important;border-collapse:collapse;font-size:12.5px}
.tcc-tbl thead{background:transparent!important}
.tcc-tbl th{text-align:left!important;color:${T.muted}!important;font-weight:600;font-size:10.5px;text-transform:uppercase;padding:7px 8px!important;border-bottom:1px solid ${T.border}}
.tcc-tbl tbody{border:0!important}.tcc-tbl tbody tr{background:transparent!important}
.tcc-tbl td{padding:8px 8px!important;border-bottom:1px solid rgba(255,255,255,.06)!important;color:${T.text}}
.tcc-srow{cursor:pointer;transition:background .12s}.tcc-srow:hover td{background:rgba(255,255,255,.04)!important}
.tcc-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;white-space:nowrap}
.tcc-staffgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
.tcc-staffc{border:1px solid ${T.border};border-radius:12px;padding:11px 13px;background:rgba(255,255,255,.02);cursor:pointer;transition:.15s}
.tcc-staffc:hover{border-color:rgba(45,212,191,.45);background:rgba(45,212,191,.05);transform:translateY(-2px)}
.tcc-bar{height:6px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden}.tcc-bar>i{display:block;height:100%;border-radius:99px}
.tcc input[type=range]{accent-color:${T.gold};height:4px}
.tcc-scan{position:relative;border-radius:14px;overflow:hidden;border:2px solid rgba(45,212,191,.45);background:#05080d;width:100%;aspect-ratio:1/1;box-shadow:0 0 26px -6px rgba(45,212,191,.45)}
.tcc-scan>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 18%;filter:contrast(1.04) saturate(1.02)}
.tcc-scan .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(95% 85% at 50% 36%, rgba(5,8,13,0) 38%, rgba(5,8,13,.45) 72%, rgba(5,8,13,.92) 100%)}
.tcc-scan .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(45,212,191,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(45,212,191,.07) 1px,transparent 1px);background-size:22px 22px;pointer-events:none}
.tcc-scan .line{position:absolute;left:6%;right:6%;height:3px;border-radius:2px;background:linear-gradient(90deg,transparent,#2DD4BF,transparent);box-shadow:0 0 16px #2DD4BF;animation:tccScan 1.6s ease-in-out infinite}
@keyframes tccScan{0%{top:7%}50%{top:90%}100%{top:7%}}
.tcc-cn{position:absolute;width:26px;height:26px;border:3px solid #2DD4BF}
.tcc-cn.tl{top:10px;left:10px;border-right:0;border-bottom:0;border-radius:6px 0 0 0}
.tcc-cn.tr{top:10px;right:10px;border-left:0;border-bottom:0;border-radius:0 6px 0 0}
.tcc-cn.bl{bottom:10px;left:10px;border-right:0;border-top:0;border-radius:0 0 0 6px}
.tcc-cn.br{bottom:10px;right:10px;border-left:0;border-top:0;border-radius:0 0 6px 0}
.tcc-scan .tag{position:absolute;left:10px;top:10px;font-size:10px;font-weight:700;color:#2DD4BF;background:rgba(0,0,0,.5);padding:2px 8px;border-radius:6px;letter-spacing:1px;font-family:"JetBrains Mono"}
.tcc-scan .ok{position:absolute;inset:0;display:grid;place-items:center;background:rgba(47,191,135,.22);animation:tccOk .45s}
.tcc-scan .ok b{font-size:64px;color:#2FBF87;text-shadow:0 0 24px rgba(47,191,135,.8)}
@keyframes tccOk{from{opacity:0;transform:scale(.6)}}
.tcc-feedrow{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid ${T.border};animation:tccFeedIn .4s}
@keyframes tccFeedIn{from{opacity:0;transform:translateX(-12px)}}
.tcc-split{display:grid;grid-template-columns:minmax(300px,360px) 1fr;gap:14px;margin-bottom:16px}
@media(max-width:960px){.tcc-split{grid-template-columns:1fr}}
.mkz-2x2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
@media(max-width:1000px){.mkz-2x2{grid-template-columns:1fr}}
.tcc-live{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;letter-spacing:.6px;color:#2DD4BF}
.tcc-live i{width:8px;height:8px;border-radius:50%;background:#2DD4BF;box-shadow:0 0 8px #2DD4BF;animation:tccBlink 1.1s infinite}
@keyframes tccBlink{50%{opacity:.25}}
.tcc-srow{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:11px;border:1px solid ${T.border};background:rgba(255,255,255,.02)}
.tcc-bar{height:6px;border-radius:4px;background:rgba(255,255,255,.07);overflow:hidden}
.tcc-bar>i{display:block;height:100%;border-radius:4px}
.tcc-modal{position:fixed;inset:0;z-index:99999;background:rgba(5,10,15,.78);display:grid;place-items:center;padding:18px;backdrop-filter:blur(4px);animation:tccFade .2s ease}
@keyframes tccFade{from{opacity:0}}
.tcc-mbox{color:${T.text};font-family:Inter,system-ui,sans-serif;background:${T.panel};border:1px solid ${T.border};border-radius:18px;width:min(1080px,96vw);max-height:88vh;overflow:auto;display:flex;flex-direction:column;padding:18px 20px;box-shadow:0 40px 100px rgba(0,0,0,.7);transform:scale(.92);opacity:0;animation:tccGrow .28s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tccGrow{to{transform:scale(1);opacity:1}}
.tcc-mbox .mc{position:relative}
.tcc-x{border:1px solid ${T.border};background:rgba(255,255,255,.03);border-radius:8px;width:34px;height:34px;cursor:pointer;color:${T.text};font-size:18px}
.tcc-face{width:46px;height:46px;border-radius:8px;object-fit:cover;border:1px solid ${T.border};filter:grayscale(.35) contrast(1.1)}
.tcc-c3{grid-column:span 3}.tcc-c4{grid-column:span 4}.tcc-c5{grid-column:span 5}.tcc-c6{grid-column:span 6}.tcc-c8{grid-column:span 8}.tcc-c12{grid-column:span 12}
.tcc a:focus-visible,.tcc button:focus-visible,.tcc select:focus-visible,.tcc input:focus-visible{outline:3px solid ${T.gold};outline-offset:2px;border-radius:8px}
.hex{transition:transform .18s,filter .18s;cursor:pointer;transform-box:fill-box;transform-origin:center}.hex:hover{transform:scale(1.12);filter:brightness(1.25)}
@media(max-width:1100px){.tcc-hero{grid-template-columns:repeat(2,1fr)}.tcc-inst{grid-template-columns:1fr}.tcc-c4,.tcc-c5,.tcc-c6,.tcc-c8{grid-column:span 12}.tcc-c3{grid-column:span 6}}
@media(max-width:640px){.tcc-hero{grid-template-columns:1fr}.tcc-c3{grid-column:span 12}}
@media(prefers-reduced-motion:reduce){.tcc *,.tcc::after{animation:none!important;transition:none!important}.tcc-card,.tcc-top,.tcc-mbox{opacity:1!important;transform:none!important}}
`;

export function useInjectCC() {
  useEffect(() => {
    if (!document.getElementById("tcc-style")) { const st = document.createElement("style"); st.id = "tcc-style"; st.textContent = CSS; document.head.appendChild(st); }
    if (!document.getElementById("tcc-fonts")) { const l = document.createElement("link"); l.id = "tcc-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"; document.head.appendChild(l); }
  }, []);
}

export function useCountUp(target, dur = 1300) {
  const [v, setV] = useState(reduced ? target : 0);
  useEffect(() => { if (reduced) { setV(target); return; } let raf; const t0 = performance.now(); const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setV(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [target, dur]);
  return v;
}
export function useTween(target, dur = 450) {
  const [v, setV] = useState(target); const from = useRef(target);
  useEffect(() => { if (reduced) { setV(target); from.current = target; return; } const a = from.current, t0 = performance.now(); let raf; const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setV(a + (target - a) * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); else from.current = target; }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [target, dur]);
  return v;
}

export function MiniChart({ option, height = 200 }) {
  const ref = useRef(null), inst = useRef(null);
  useEffect(() => { if (!ref.current) return; inst.current = echarts.init(ref.current); inst.current.setOption(option); const ro = new ResizeObserver(() => inst.current && inst.current.resize()); ro.observe(ref.current); return () => { ro.disconnect(); inst.current && inst.current.dispose(); }; }, []);
  useEffect(() => { inst.current && inst.current.setOption(option, true); }, [option]);
  return <div ref={ref} style={{ width: "100%", height }} />;
}

export function EPanel({ title, subtitle, note, option, className = "tcc-c6", delay = 0, height = 240 }) {
  const ref = useRef(null), inst = useRef(null), mref = useRef(null), minst = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!ref.current) return; inst.current = echarts.init(ref.current); inst.current.setOption(option); const ro = new ResizeObserver(() => inst.current && inst.current.resize()); ro.observe(ref.current); return () => { ro.disconnect(); inst.current && inst.current.dispose(); }; }, []);
  useEffect(() => { inst.current && inst.current.setOption(option, true); }, [option]);
  useEffect(() => { if (!open || !mref.current) return; minst.current = echarts.init(mref.current); minst.current.setOption(option); const ro = new ResizeObserver(() => minst.current && minst.current.resize()); ro.observe(mref.current); const onKey = (e) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", onKey); return () => { ro.disconnect(); window.removeEventListener("keydown", onKey); minst.current && minst.current.dispose(); }; }, [open]);
  return (
    <div className={`tcc-card ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="hd"><div><div className="t">{title}</div>{subtitle && <div className="s">{subtitle}</div>}</div><button className="tcc-exp" aria-label={`${title} kengaytirish`} onClick={() => setOpen(true)}>⤢</button></div>
      <div className="tcc-ch" ref={ref} style={{ height }} />
      {note && <div className="tcc-note">{note}</div>}
      {open && createPortal(
        <div className="tcc-modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="tcc-mbox" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}><div><div style={{ fontFamily: '"Space Grotesk",Inter', fontWeight: 700, fontSize: 16 }}>{title}</div><div style={{ fontSize: 11.5, color: T.muted }}>{subtitle} · Esc</div></div><button className="tcc-x" onClick={() => setOpen(false)}>×</button></div>
            <div className="mc" ref={mref} style={{ height: "62vh" }} />
          </div>
        </div>, document.body)}
    </div>
  );
}

export function CcTop({ title = "Mahalla Ta'lim Komandavoy Markazi", subtitle, right }) {
  return (
    <div className="tcc-top">
      <div className="tcc-emb">UT</div>
      <div style={{ marginRight: "auto" }}><div className="nm">{title}</div><div className="sb">{subtitle}</div></div>
      <span className="tcc-live"><i /> JONLI</span>
      {right}
      <div className="sb mono">24.06.2026</div>
    </div>
  );
}

// ECharts opsiya yordamchilari
export const tip = { backgroundColor: "#0c1620", borderColor: T.border, textStyle: { color: T.text } };
const baseGrid = { left: 8, right: 14, top: 18, bottom: 22, containLabel: true };
const ax = { axisLine: { lineStyle: { color: "rgba(255,255,255,.14)" } }, axisLabel: { color: T.muted, fontSize: 10 }, splitLine: { lineStyle: { color: "rgba(255,255,255,.05)" } } };
export const lineOpt = (data, labels, color, min = 80, max = 100, pct = true) => ({ backgroundColor: "transparent", grid: baseGrid, tooltip: { trigger: "axis", ...tip }, xAxis: { type: "category", data: labels, ...ax }, yAxis: { type: "value", min, max, ...ax, axisLabel: { ...ax.axisLabel, formatter: pct ? "{value}%" : "{value}" } }, series: [{ type: "line", smooth: true, data, symbol: "circle", symbolSize: 4, lineStyle: { color, width: 2.2, shadowColor: color, shadowBlur: 10 }, itemStyle: { color }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: color + "55" }, { offset: 1, color: color + "00" }]) } }] });
export const barOpt = (labels, data, color) => ({ backgroundColor: "transparent", grid: baseGrid, tooltip: { trigger: "axis", ...tip }, xAxis: { type: "category", data: labels, ...ax }, yAxis: { type: "value", ...ax }, series: [{ type: "bar", data, itemStyle: { color, borderRadius: [4, 4, 0, 0] }, barWidth: "58%" }] });
export const donutOpt = (b, g) => ({ backgroundColor: "transparent", tooltip: { trigger: "item", ...tip }, legend: { bottom: 0, textStyle: { color: T.muted, fontSize: 11 }, icon: "circle" }, series: [{ type: "pie", radius: ["55%", "76%"], center: ["50%", "44%"], label: { show: false }, data: [{ value: b, name: "O'g'il bola", itemStyle: { color: T.teal } }, { value: g, name: "Qiz bola", itemStyle: { color: T.gold } }] }] });
