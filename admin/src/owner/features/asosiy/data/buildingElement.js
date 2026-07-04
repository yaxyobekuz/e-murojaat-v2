// Bosilgan real OSM binosini barqaror "element" obyektiga aylantiradi.
// id bino markazidan hash qilinadi — bir bino har doim bir xil kartochka ko'rsatadi.
// Tur: katta/baland binolar "zavod", qolganlari "uy" — DetailPanel shu turlardan foydalanadi.

const centroid = (ring) => {
  let x = 0;
  let y = 0;
  const n = ring.length - 1;
  for (let i = 0; i < n; i++) {
    x += ring[i][0];
    y += ring[i][1];
  }
  return [x / n, y / n];
};

// footprint yuzasi (m²) — lokal equirectangular proyeksiyada shoelace
const footprintArea = (ring) => {
  const lat0 = (ring[0][1] * Math.PI) / 180;
  const mLng = 111_320 * Math.cos(lat0);
  const mLat = 110_540;
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const x1 = ring[i][0] * mLng;
    const y1 = ring[i][1] * mLat;
    const x2 = ring[i + 1][0] * mLng;
    const y2 = ring[i + 1][1] * mLat;
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
};

// real binodan barqaror element — id koordinatadan, tur balandlik/yuzaga qarab
export const buildingElement = (feature) => {
  const ring = feature.geometry?.coordinates?.[0] || [[71.934255, 40.879317]];
  const [lng, lat] = centroid(ring);
  const height = Math.max(3, Math.round(feature.properties?.height || 9));
  const area = Math.max(24, Math.round(footprintArea(ring)));
  // katta tijorat/ishlab chiqarish binolari → zavod, qolganlari → uy
  const type = height >= 24 || area >= 900 ? "zavod" : "uy";
  const id = `bld_${lng.toFixed(5)}_${lat.toFixed(5)}`;
  return { id, type, cx: lng, cy: lat, lng, lat, height, area };
};
