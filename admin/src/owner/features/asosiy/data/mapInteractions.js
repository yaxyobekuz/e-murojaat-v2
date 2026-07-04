// Real bino izlari uchun click + hover. Tashqi onPick(element) / onHover(id) ga uzatadi.
import { LAYER, BUILDINGS_SOURCE } from "./mapLayers";
import { buildingElement } from "./buildingElement";
import { filterStatusOf, TONE_CODE } from "./elementData";

export const attachInteractions = (map, { onPick, onHover }) => {
  const canvas = map.getCanvas();
  let selected = null;
  let hovered = null;
  let activeFilter = null;
  const painted = new Set(); // fstatus qo'yilgan bino id'lari

  const src = { source: BUILDINGS_SOURCE };
  const setState = (id, key, on) => {
    if (id == null) return;
    if (on) map.setFeatureState({ ...src, id }, { [key]: true });
    // false o'rniga butunlay o'chiramiz — "selected"/"hover" qoldig'i oq bo'lib qolmasin
    else map.removeFeatureState({ ...src, id }, key);
  };

  const buildingAt = (pt) => {
    if (!map.getLayer(LAYER.buildings)) return null;
    return map.queryRenderedFeatures(pt, { layers: [LAYER.buildings] })[0];
  };

  // ===== Filter bo'yash =====
  const clearPaint = () => {
    painted.forEach((id) => map.setFeatureState({ ...src, id }, { fstatus: 0 }));
    painted.clear();
  };

  const paintVisible = () => {
    if (!activeFilter || !map.getLayer(LAYER.buildings)) return;
    const feats = map.queryRenderedFeatures({ layers: [LAYER.buildings] });
    for (const f of feats) {
      if (f.id == null || painted.has(f.id)) continue;
      const tone = filterStatusOf(buildingElement(f), activeFilter);
      if (!tone) continue;
      map.setFeatureState({ ...src, id: f.id }, { fstatus: TONE_CODE[tone] });
      painted.add(f.id);
    }
  };

  const onIdle = () => paintVisible();

  const applyFilter = (filterKey) => {
    if (filterKey === activeFilter) return;
    clearPaint();
    activeFilter = filterKey || null;
    if (activeFilter) {
      map.on("idle", onIdle);
      paintVisible();
    } else {
      map.off("idle", onIdle);
    }
  };

  const onMove = (e) => {
    const f = buildingAt(e.point);
    canvas.style.cursor = f ? "pointer" : "";
    const id = f?.id;
    if (id === hovered) return;
    if (hovered != null && hovered !== selected) setState(hovered, "hover", false);
    hovered = id ?? null;
    if (hovered != null && hovered !== selected) setState(hovered, "hover", true);
    onHover?.(f ? buildingElement(f).id : null);
  };

  const onClick = (e) => {
    const f = buildingAt(e.point);
    // eski tanlangan binoni butunlay tozalaymiz (selected + hover qoldig'i)
    if (selected != null) {
      setState(selected, "selected", false);
      setState(selected, "hover", false);
    }
    if (!f) {
      selected = null;
      onPick(null);
      return;
    }
    selected = f.id ?? null;
    // yangi tanlangan binoda hover holatini ham olib tashlaymiz (faqat selected qolsin)
    hovered = null;
    setState(selected, "hover", false);
    setState(selected, "selected", true);
    onPick(buildingElement(f));
  };

  map.on("mousemove", onMove);
  map.on("click", onClick);

  // tashqaridan tanlovni tozalash uchun
  const clearSelection = () => {
    if (selected != null) {
      setState(selected, "selected", false);
      setState(selected, "hover", false);
    }
    selected = null;
  };

  return {
    detach: () => {
      map.off("mousemove", onMove);
      map.off("click", onClick);
      map.off("idle", onIdle);
    },
    clearSelection,
    applyFilter,
  };
};
