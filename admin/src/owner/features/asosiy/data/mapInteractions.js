// Real bino izlari uchun click + hover. Tashqi onPick(element) / onHover(id) ga uzatadi.
import { LAYER } from "./mapLayers";
import { buildingElement } from "./buildingElement";

export const attachInteractions = (map, { onPick, onHover }) => {
  const canvas = map.getCanvas();
  let selected = null;
  let hovered = null;

  const src = { source: "composite", sourceLayer: "building" };
  const setState = (id, key, on) =>
    id != null && map.setFeatureState({ ...src, id }, { [key]: on });

  const buildingAt = (pt) => {
    if (!map.getLayer(LAYER.buildings)) return null;
    return map.queryRenderedFeatures(pt, { layers: [LAYER.buildings] })[0];
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
    if (selected != null) setState(selected, "selected", false);
    if (!f) {
      selected = null;
      onPick(null);
      return;
    }
    selected = f.id ?? null;
    setState(selected, "selected", true);
    onPick(buildingElement(f));
  };

  map.on("mousemove", onMove);
  map.on("click", onClick);

  // tashqaridan tanlovni tozalash uchun
  const clearSelection = () => {
    if (selected != null) setState(selected, "selected", false);
    selected = null;
  };

  return {
    detach: () => {
      map.off("mousemove", onMove);
      map.off("click", onClick);
    },
    clearSelection,
  };
};
