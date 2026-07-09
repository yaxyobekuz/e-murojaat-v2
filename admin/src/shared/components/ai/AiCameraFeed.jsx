// AI kamera oqimi — video ustiga real-time obyekt aniqlash (COCO-SSD) +
// motion tracking. Har obyekt: bounding box + nishon (crosshair) + belgisi;
// harakatlanayotgani "yugurish" belgisi bilan ko'rsatiladi.
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { loadDetector } from "@/shared/lib/aiDetector";

const BLUE = "#3B82F6";
// COCO klasslari -> o'zbekcha
const LABELS = {
  person: "Inson", car: "Avtomobil", truck: "Yuk mashina", bus: "Avtobus",
  motorcycle: "Mototsikl", bicycle: "Velosiped", dog: "It", cat: "Mushuk",
  backpack: "Ryukzak", handbag: "Sumka", "cell phone": "Telefon", umbrella: "Soyabon",
};
const labelOf = (cls) => LABELS[cls] || cls.charAt(0).toUpperCase() + cls.slice(1);

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Yugurayotgan odam belgisi (harakat indikatori)
function drawRunner(ctx, x, y, s) {
  const u = s * 0.13, cx = x + s * 0.5, cy = y + s * 0.5;
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = Math.max(1.4, s * 0.09);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx - u * 0.1, cy - u * 2.1, u * 0.7, 0, Math.PI * 2);
  ctx.fill(); // bosh
  ctx.beginPath();
  ctx.moveTo(cx - u * 0.1, cy - u * 1.3);
  ctx.lineTo(cx + u * 0.4, cy + u * 0.3); // tana
  ctx.moveTo(cx + u * 0.4, cy + u * 0.3);
  ctx.lineTo(cx + u * 1.3, cy + u * 1.2); // oldingi oyoq
  ctx.moveTo(cx + u * 0.4, cy + u * 0.3);
  ctx.lineTo(cx - u * 1.0, cy + u * 1.3); // orqa oyoq
  ctx.moveTo(cx, cy - u * 0.5);
  ctx.lineTo(cx + u * 1.3, cy - u * 0.9); // qo'l
  ctx.moveTo(cx, cy - u * 0.5);
  ctx.lineTo(cx - u * 1.0, cy - u * 0.1); // qo'l
  ctx.stroke();
}

function drawBox(ctx, x, y, w, h, label, score, moving) {
  const cx = x + w / 2, cy = y + h / 2;
  const lw = Math.max(2, w * 0.01);

  // Ramka
  ctx.strokeStyle = BLUE;
  ctx.lineWidth = lw;
  ctx.fillStyle = moving ? "rgba(59,130,246,0.16)" : "rgba(59,130,246,0.08)";
  if (moving) {
    ctx.shadowColor = BLUE;
    ctx.shadowBlur = 14;
  }
  roundRect(ctx, x, y, w, h, Math.min(14, w * 0.08));
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Nishon (crosshair) — markazda
  const r = Math.max(8, Math.min(w, h) * 0.16);
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = Math.max(1.5, w * 0.008);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  const g = r * 0.55, L = r * 1.8;
  ctx.beginPath();
  ctx.moveTo(cx - L, cy); ctx.lineTo(cx - g, cy);
  ctx.moveTo(cx + g, cy); ctx.lineTo(cx + L, cy);
  ctx.moveTo(cx, cy - L); ctx.lineTo(cx, cy - g);
  ctx.moveTo(cx, cy + g); ctx.lineTo(cx, cy + L);
  ctx.stroke();
  ctx.fillStyle = BLUE;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Belgi (label) — yuqori chapda
  const fs = Math.max(12, Math.round(w * 0.05));
  ctx.font = `700 ${fs}px Inter, system-ui, sans-serif`;
  const txt = `${label} ${Math.round(score * 100)}%`;
  const pad = fs * 0.5, th = fs + pad, tw = ctx.measureText(txt).width + pad * 2;
  const ly = y - th - 4 < 0 ? y + 2 : y - th - 4;
  ctx.fillStyle = BLUE;
  roundRect(ctx, x, ly, tw, th, 5);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(txt, x + pad, ly + th / 2);

  // Harakat belgisi — yuqori o'ngda
  if (moving) {
    const bs = Math.max(22, w * 0.16);
    const bx = x + w - bs, by = y;
    ctx.fillStyle = BLUE;
    roundRect(ctx, bx, by, bs, bs, 5);
    ctx.fill();
    drawRunner(ctx, bx, by, bs);
  }
}

function drawFrame(canvas, video, preds, tracksRef, nextIdRef) {
  if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
  if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const prev = tracksRef.current;
  const cur = [];
  let count = 0;
  for (const p of preds) {
    const [x, y, w, h] = p.bbox;
    if (w < 16 || h < 16) continue;
    const cx = x + w / 2, cy = y + h / 2;
    // eng yaqin oldingi track bilan moslash (oddiy tracker)
    let best = null, bd = Infinity;
    for (const t of prev) {
      const d = Math.hypot(t.cx - cx, t.cy - cy);
      if (d < bd) { bd = d; best = t; }
    }
    const near = best && bd < Math.max(w, h);
    const id = near ? best.id : nextIdRef.current++;
    const vx = near ? cx - best.cx : 0, vy = near ? cy - best.cy : 0;
    const moving = Math.hypot(vx, vy) > Math.max(3, w * 0.015);
    cur.push({ id, cx, cy });
    drawBox(ctx, x, y, w, h, labelOf(p.class), p.score, moving);
    count++;
  }
  tracksRef.current = cur;
  return count;
}

export default function AiCameraFeed({ src, stream, ai = true, fps = 6, className, muted = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const tracks = useRef([]);
  const nextId = useRef(1);
  const lastT = useRef(0);
  const raf = useRef(0);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  // MediaStream (real WebRTC) ni ulash
  useEffect(() => {
    const v = videoRef.current;
    if (v && stream) {
      v.srcObject = stream;
      v.play?.().catch(() => {});
    }
  }, [stream]);

  useEffect(() => {
    if (!ai) return;
    let stop = false;
    let model = null;
    loadDetector().then((m) => { if (!stop) { model = m; setReady(true); } });
    const loop = async (t) => {
      if (stop) return;
      const v = videoRef.current, c = canvasRef.current;
      if (model && v && c && v.videoWidth && v.readyState >= 2 && !v.paused) {
        if (t - lastT.current > 1000 / fps) {
          lastT.current = t;
          try {
            const preds = await model.detect(v, 20, 0.5);
            setCount(drawFrame(c, v, preds, tracks, nextId));
          } catch {
            /* video hali tayyor emas / CORS */
          }
        }
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { stop = true; cancelAnimationFrame(raf.current); };
  }, [ai, fps]);

  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      <video ref={videoRef} src={src} autoPlay muted={muted} loop playsInline crossOrigin="anonymous" className="absolute inset-0 size-full object-cover" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full object-cover" />
      {ai && (
        <div className="pointer-events-none absolute left-2 top-2 z-10 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-brand-cyan">
          <span className={cn("size-1.5 rounded-full", ready ? "animate-pulse bg-brand-cyan shadow-[0_0_6px_#22d3ee]" : "bg-amber-400")} />
          AI · {ready ? `${count} obyekt` : "model yuklanmoqda…"}
        </div>
      )}
    </div>
  );
}
