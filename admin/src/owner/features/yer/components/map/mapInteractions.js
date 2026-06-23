// Click + hover wiring for the real building footprints.
import { LAYER } from "./mapLayers";
import { buildingInfo } from "./buildingInfo";

export const attachInteractions = (map, onPick) => {
  const canvas = map.getCanvas();
  let selected = null;
  let hovered = null;

  const src = { source: "composite", sourceLayer: "building" };
  const setState = (id, on) =>
    id != null && map.setFeatureState({ ...src, id }, { selected: on });

  const buildingAt = (pt) => {
    if (!map.getLayer(LAYER.buildings)) return null;
    return map.queryRenderedFeatures(pt, { layers: [LAYER.buildings] })[0];
  };

  const onMove = (e) => {
    const f = buildingAt(e.point);
    canvas.style.cursor = f ? "pointer" : "";
    const id = f?.id;
    if (id === hovered) return;
    if (hovered != null && hovered !== selected) setState(hovered, false);
    hovered = id ?? null;
    if (hovered != null && hovered !== selected) setState(hovered, true);
  };

  const onClick = (e) => {
    const f = buildingAt(e.point);
    if (selected != null) setState(selected, false);
    if (!f) {
      selected = null;
      onPick(null);
      return;
    }
    selected = f.id ?? null;
    setState(selected, true);
    onPick(buildingInfo(f));
  };

  map.on("mousemove", onMove);
  map.on("click", onClick);

  return () => {
    map.off("mousemove", onMove);
    map.off("click", onClick);
  };
};
