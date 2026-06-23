// DOM pin markers for notable government objects. Markers persist across
// basemap switches, so they're added once.
import mapboxgl from "mapbox-gl";
import { CADASTRE_MARKERS } from "../../mock/yer.mapMarkers";

export const addGovMarkers = (map, onPick) =>
  CADASTRE_MARKERS.map((m) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "cad-pin";
    el.title = m.title;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onPick({
        title: m.title,
        info: { ...m.info, lng: m.position.lng, lat: m.position.lat },
      });
    });
    return new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([m.position.lng, m.position.lat])
      .addTo(map);
  });
