// Real OSM obyektlari uchun click + hover: bino > yo'l > dala tartibida tanlanadi.
// Tashqi onPick(element) / onHover(id) ga uzatadi.
import { LAYER, OSM_SOURCE } from "./mapLayers";
import { osmElement } from "./osmElement";
import { filterStatusOf, TONE_CODE } from "./elementData";

export const attachInteractions = (map, { onPick, onHover }) => {
  const canvas = map.getCanvas();
  let selected = null;
  let hovered = null;
  let activeFilter = null;
  const painted = new Set(); // fstatus qo'yilgan bino id'lari

  const src = { source: OSM_SOURCE };
  const setState = (id, key, on) => {
    if (id == null) return;
    if (on) map.setFeatureState({ ...src, id }, { [key]: true });
    // false o'rniga butunlay o'chiramiz — "selected"/"hover" qoldig'i oq bo'lib qolmasin
    else map.removeFeatureState({ ...src, id }, key);
  };

  // ustma-ust kelganda render tartibi bo'yicha: bino > yo'l > landuse
  const PICK_LAYERS = [LAYER.buildings, LAYER.roads, LAYER.landuse];
  const pickAt = (pt) => {
    const layers = PICK_LAYERS.filter((id) => map.getLayer(id));
    if (!layers.length) return null;
    for (const f of map.queryRenderedFeatures(pt, { layers })) {
      const el = osmElement(f);
      if (el) return { f, el };
    }
    return null;
  };

  // ===== Filter bo'yash (faqat binolar) =====
  const clearPaint = () => {
    painted.forEach((id) => map.setFeatureState({ ...src, id }, { fstatus: 0 }));
    painted.clear();
  };

  const paintVisible = () => {
    if (!activeFilter || !map.getLayer(LAYER.buildings)) return;
    const feats = map.queryRenderedFeatures({ layers: [LAYER.buildings] });
    for (const f of feats) {
      if (f.id == null || painted.has(f.id)) continue;
      const el = osmElement(f);
      const tone = el && filterStatusOf(el, activeFilter);
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
    const hit = pickAt(e.point);
    canvas.style.cursor = hit ? "pointer" : "";
    // hover highlight bino va landuse'da (yo'l chizig'ida yo'q)
    const id = hit && hit.f.properties.kind !== "road" ? hit.f.id : null;
    if (id === hovered) {
      if (!hit) onHover?.(null);
      return;
    }
    if (hovered != null && hovered !== selected) setState(hovered, "hover", false);
    hovered = id ?? null;
    if (hovered != null && hovered !== selected) setState(hovered, "hover", true);
    onHover?.(hit ? hit.el.id : null);
  };

  const onClick = (e) => {
    const hit = pickAt(e.point);
    // eski tanlangan obyektni butunlay tozalaymiz (selected + hover qoldig'i)
    if (selected != null) {
      setState(selected, "selected", false);
      setState(selected, "hover", false);
    }
    if (!hit) {
      selected = null;
      onPick(null);
      return;
    }
    selected = hit.f.id ?? null;
    // yangi tanlangan obyektda hover holatini ham olib tashlaymiz (faqat selected qolsin)
    hovered = null;
    setState(selected, "hover", false);
    setState(selected, "selected", true);
    onPick(hit.el);
  };

  // jonli OSM yangilanishida feature id'lar qayta tug'iladi — ichki holatni tozalaymiz
  const onRefreshed = () => {
    painted.clear();
    selected = null;
    hovered = null;
    if (activeFilter) paintVisible();
  };

  map.on("mousemove", onMove);
  map.on("click", onClick);
  map.on("buildings:refreshed", onRefreshed);

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
      map.off("buildings:refreshed", onRefreshed);
    },
    clearSelection,
    applyFilter,
  };
};
