// Bosilgan real OSM obyektini barqaror "element"ga aylantiradi.
// id geometriya markazidan hash — bir obyekt har doim bir xil kartochka ko'rsatadi.
// Tur OSM feature type'idan: building→uy/zavod, landuse→dala/zavod, highway→yol.
// Real kiritilgan ma'lumotlar (name, height, building:levels) elementga o'tadi.

const centroid = (pts) => {
  let x = 0;
  let y = 0;
  const n = Math.max(1, pts.length - 1);
  for (let i = 0; i < n; i++) {
    x += pts[i][0];
    y += pts[i][1];
  }
  return [x / n, y / n];
};

// yuza (m²) — lokal equirectangular proyeksiyada shoelace
const footprintArea = (ring) => {
  const lat0 = (ring[0][1] * Math.PI) / 180;
  const mLng = 111_320 * Math.cos(lat0);
  const mLat = 110_540;
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    a += ring[i][0] * mLng * (ring[i + 1][1] * mLat) - ring[i + 1][0] * mLng * (ring[i][1] * mLat);
  }
  return Math.abs(a) / 2;
};

const lineLength = (pts) => {
  const lat0 = (pts[0][1] * Math.PI) / 180;
  const mLng = 111_320 * Math.cos(lat0);
  const mLat = 110_540;
  let len = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    len += Math.hypot((pts[i + 1][0] - pts[i][0]) * mLng, (pts[i + 1][1] - pts[i][1]) * mLat);
  }
  return len;
};

const INDUSTRIAL_BUILDINGS = new Set(["industrial", "warehouse", "works", "factory", "manufacture"]);
const FIELD_CATS = new Set([
  "farmland", "farmyard", "orchard", "vineyard", "meadow",
  "grass", "grassland", "allotments", "greenhouse_horticulture",
]);

export const osmElement = (feature) => {
  const p = feature.properties || {};

  if (p.kind === "building") {
    const ring = feature.geometry?.coordinates?.[0] || [[71.934255, 40.879317]];
    const [lng, lat] = centroid(ring);
    const height = Math.max(3, Math.round(p.height || 4));
    const area = Math.max(24, Math.round(footprintArea(ring)));
    const type = INDUSTRIAL_BUILDINGS.has(p.btype) || (!p.btype && (height >= 24 || area >= 900)) ? "zavod" : "uy";
    return {
      id: `bld_${lng.toFixed(5)}_${lat.toFixed(5)}`,
      type, cx: lng, cy: lat, lng, lat, height, area,
      osmId: p.osmId ? String(p.osmId) : null,
      name: p.name || null,
      levels: p.levels || null,
      btype: p.btype || null,
    };
  }

  if (p.kind === "landuse") {
    const isField = FIELD_CATS.has(p.cat);
    if (!isField && p.cat !== "industrial") return null; // boshqa landuse bosilmaydi
    const ring = feature.geometry?.coordinates?.[0] || [[71.934255, 40.879317]];
    const [lng, lat] = centroid(ring);
    const area = Math.round(footprintArea(ring));
    return {
      id: `lu_${lng.toFixed(5)}_${lat.toFixed(5)}`,
      type: isField ? "dala" : "zavod",
      cx: lng, cy: lat, lng, lat, area,
      areaHa: area / 10_000,
      name: p.name || null,
      cat: p.cat,
    };
  }

  if (p.kind === "road") {
    const pts = feature.geometry?.coordinates || [[71.934255, 40.879317]];
    const [lng, lat] = centroid([...pts, pts[0]]);
    return {
      id: `yol_${lng.toFixed(5)}_${lat.toFixed(5)}`,
      type: "yol",
      cx: lng, cy: lat, lng, lat,
      length: Math.round(lineLength(pts)),
      name: p.name || null,
      cls: p.cls,
    };
  }

  return null;
};
