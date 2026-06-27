// Erkin pan (sudrash) + zoom (g'ildirak / tugma) — SVG viewport transform boshqaruvi.
// transform: { x, y, k } (translate + scale). Kursorga nisbatan zoom va "fly to" (focusOn).
import { useCallback, useEffect, useRef, useState } from "react";

const MIN_K = 0.06;
const MAX_K = 4;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function usePanZoom(containerRef, { initial } = {}) {
  const [t, setT] = useState(initial || { x: 0, y: 0, k: 0.1 });
  const [animating, setAnimating] = useState(false);
  const drag = useRef(null);
  const tRef = useRef(t);
  const animRef = useRef(null);

  // joriy transformni ref'da saqlab turamiz (event handler/animatsiya o'qishi uchun)
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const size = () => {
    const el = containerRef.current;
    return el ? { w: el.clientWidth, h: el.clientHeight } : { w: 0, h: 0 };
  };

  // g'ildirak — kursor ostidagi nuqtani saqlab zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      setT((prev) => {
        const factor = Math.exp(-e.deltaY * 0.0014);
        const k = clamp(prev.k * factor, MIN_K, MAX_K);
        const r = k / prev.k;
        return { k, x: px - (px - prev.x) * r, y: py - (py - prev.y) * r };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [containerRef]);

  const onPointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    setAnimating(false);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: tRef.current.x, oy: tRef.current.y, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
    setT((prev) => ({ ...prev, x: d.ox + dx, y: d.oy + dy }));
  }, []);

  const endDrag = useCallback(() => {
    const moved = drag.current?.moved;
    drag.current = null;
    return moved;
  }, []);

  // tugmali zoom — markazga nisbatan
  const zoomBy = useCallback((factor) => {
    const { w, h } = size();
    const px = w / 2;
    const py = h / 2;
    setT((prev) => {
      const k = clamp(prev.k * factor, MIN_K, MAX_K);
      const r = k / prev.k;
      return { k, x: px - (px - prev.x) * r, y: py - (py - prev.y) * r };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // animatsiyali markazlash — element/butun xaritaga "uchib borish"
  const animateTo = useCallback((target, ms = 700) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const from = { ...tRef.current };
    const start = performance.now();
    setAnimating(true);
    const tick = (now) => {
      const p = clamp((now - start) / ms, 0, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setT({
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        k: from.k + (target.k - from.k) * e,
      });
      if (p < 1) animRef.current = requestAnimationFrame(tick);
      else setAnimating(false);
    };
    animRef.current = requestAnimationFrame(tick);
  }, []);

  // dunyo koordinatasini (cx,cy) ekran markaziga olib kelish, berilgan k bilan
  const focusOn = useCallback((cx, cy, k, ms) => {
    const { w, h } = size();
    if (!w) return;
    const nk = clamp(k, MIN_K, MAX_K);
    animateTo({ k: nk, x: w / 2 - cx * nk, y: h / 2 - cy * nk }, ms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateTo]);

  // butun xaritani ko'rinishga sig'dirish
  const fitTo = useCallback((bbox, ms) => {
    const { w, h } = size();
    if (!w) return;
    const bw = bbox.maxX - bbox.minX || 1;
    const bh = bbox.maxY - bbox.minY || 1;
    const k = clamp(Math.min(w / bw, h / bh) * 0.82, MIN_K, MAX_K);
    const cx = (bbox.minX + bbox.maxX) / 2;
    const cy = (bbox.minY + bbox.maxY) / 2;
    animateTo({ k, x: w / 2 - cx * k, y: h / 2 - cy * k }, ms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateTo]);

  return { t, animating, onPointerDown, onPointerMove, endDrag, zoomBy, focusOn, fitTo, setT };
}
