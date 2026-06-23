// Turns a real Mapbox building feature into a stable cadastre record. Footprint
// area + height are REAL (from geometry); the rest is deterministic mock data
// hashed from the footprint centroid, so a building always shows the same card.
const TYPES = [
  { type: "uy", label: "Yakka tartibdagi uy", rate: 2_400_000 },
  { type: "kvartira", label: "Ko'p qavatli turar-joy", rate: 3_100_000 },
  { type: "noturar", label: "Noturar (tijorat) bino", rate: 4_600_000 },
];
const OWNERSHIP = [
  { v: "xususiy", label: "Xususiy" },
  { v: "davlat", label: "Davlat" },
  { v: "ulushli", label: "Ulushli" },
];
const STATUSES = ["royxatda", "royxatda", "royxatda", "jarayonda", "nizoli"];
const OWNERS = [
  "Karimov A.", "Yusupova M.", "Toshtemirov B.", "Rahimova D.", "Ergashev S.",
  "Qodirova N.", "Sharipov J.", "Islomova F.", "Abdullayev T.", "Nazarova G.",
];
const STREETS = ["Bobur", "Navoiy", "Amir Temur", "Fitrat", "Cho'lpon", "Fidokor"];

const hashStr = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
};

// Polygon footprint area (m²) via shoelace on a local equirectangular projection.
const footprintArea = (ring) => {
  const lat0 = (ring[0][1] * Math.PI) / 180;
  const mLng = 111_320 * Math.cos(lat0);
  const mLat = 110_540;
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = [ring[i][0] * mLng, ring[i][1] * mLat];
    const [x2, y2] = [ring[i + 1][0] * mLng, ring[i + 1][1] * mLat];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
};

const centroid = (ring) => {
  let x = 0;
  let y = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    x += ring[i][0];
    y += ring[i][1];
  }
  const n = ring.length - 1;
  return [x / n, y / n];
};

export const buildingInfo = (feature) => {
  const ring = feature.geometry?.coordinates?.[0] || [[72.344, 40.782]];
  const [lng, lat] = centroid(ring);
  const seed = hashStr(`${lng.toFixed(5)},${lat.toFixed(5)}`);

  const height = Math.max(3, Math.round(feature.properties?.height || 9));
  const floors = Math.max(1, Math.round(height / 3.2));
  const area = Math.max(24, Math.round(footprintArea(ring)));
  const t = TYPES[seed % TYPES.length];
  const own = OWNERSHIP[(seed >> 3) % OWNERSHIP.length];
  const status = STATUSES[(seed >> 6) % STATUSES.length];

  return {
    title: t.label,
    info: {
      cadastreNumber: `UZ:03:01:${String((seed % 30) + 1).padStart(2, "0")}:${String(seed % 9999).padStart(4, "0")}`,
      typeLabel: t.label,
      type: t.type,
      owner: OWNERS[(seed >> 9) % OWNERS.length],
      ownershipLabel: own.label,
      address: `${STREETS[(seed >> 12) % STREETS.length]} ko'chasi, ${(seed % 120) + 1}-uy`,
      floors,
      height,
      areaM2: area,
      valueUzs: Math.round((area * floors * t.rate) / 1_000_000) * 1_000_000,
      status,
      lng,
      lat,
    },
  };
};
