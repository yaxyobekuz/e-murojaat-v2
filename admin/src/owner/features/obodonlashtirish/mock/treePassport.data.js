// Daraxt pasporti — yashilmakon.eco uslubida har daraxtga unikal ID + pasport.
// Asos: yashilmakon.eco (tur, bo'y, holat, GPS, foto, tirik qolish). Demo, real emas.
// Individual daraxtlar mavjud YM_PLANTINGS ekish nuqtalaridan generatsiya qilinadi.
import { YM_PLANTINGS, TREE_TYPE } from "./yashilMakon.data";

const rng = (seed) => {
  const x = Math.sin(seed * 67.7 + 23.1) * 43758.5453;
  return x - Math.floor(x);
};

// Holat (rules/02): sog'lom=yashil, zaif=amber, qurigan=qizil
export const TREE_HEALTH = {
  healthy: { label: "Sog'lom", tone: "done" },
  weak: { label: "Zaif", tone: "progress" },
  dead: { label: "Qurigan", tone: "danger" },
};

// Tur ↔ bo'y/yosh diapazoni (sm, yil)
const TYPE_GROWTH = {
  ornamental: { h: [120, 480], age: [1, 6] },
  fruit: { h: [90, 320], age: [1, 5] },
  conifer: { h: [80, 360], age: [2, 7] },
  shrub: { h: [40, 160], age: [1, 4] },
};

const REGION_CODE = "UZ-AND-BLQ"; // Andijon · Baliqchi
const fmtDate = (d) => d.toISOString().slice(0, 10);
const TODAY = new Date("2026-06-24");

// Har ekish nuqtasidan vakil (sample) daraxtlar — to'liq count emas, ko'rsatuv uchun 4-7 ta
let counter = 0;
export const TREES = YM_PLANTINGS.flatMap((p) => {
  const sample = 4 + Math.floor(rng(p.count) * 4); // 4-7 vakil daraxt
  return Array.from({ length: sample }, (_, k) => {
    counter += 1;
    const g = TYPE_GROWTH[p.type];
    const seed = counter * 1.7 + k;
    const height = Math.round(g.h[0] + rng(seed * 2.1) * (g.h[1] - g.h[0]));
    const age = g.age[0] + Math.floor(rng(seed * 3.3) * (g.age[1] - g.age[0] + 1));
    const diameter = Math.round((height / 28) * (0.8 + rng(seed * 4.4) * 0.5));
    // holat — ekish nuqtasi survivalPct ga bog'liq
    const roll = rng(seed * 5.5) * 100;
    const health = roll > p.survivalPct ? (roll > p.survivalPct + 8 ? "dead" : "weak") : "healthy";
    // koordinata — ekish nuqtasi atrofida ozgina tarqoq
    const lat = Math.round((p.lat + (rng(seed * 6.6) - 0.5) * 0.0012) * 1e6) / 1e6;
    const lng = Math.round((p.lng + (rng(seed * 7.7) - 0.5) * 0.0012) * 1e6) / 1e6;
    // ekilgan sana — yoshdan kelib chiqib
    const planted = new Date(TODAY);
    planted.setFullYear(TODAY.getFullYear() - age);
    planted.setMonth(p.season === "spring" ? 2 : 9);
    // oxirgi parvarish (sug'orish) — yaqin oylarda
    const cared = new Date(TODAY);
    cared.setDate(TODAY.getDate() - Math.floor(rng(seed * 8.8) * 45));

    const id = `${REGION_CODE}-${String(counter).padStart(5, "0")}`;
    return {
      id,
      type: p.type,
      typeLabel: TREE_TYPE[p.type],
      mahalla: p.mahalla,
      site: p.site,
      height,
      diameter,
      age,
      health,
      survivalSource: p.survivalPct,
      lat,
      lng,
      coords: `${lat}, ${lng}`,
      plantedDate: fmtDate(planted),
      lastCareDate: fmtDate(cared),
      entered: p.entered,
      // foto — barqaror seed (grayscale daraxt/tabiat)
      photo: `https://loremflickr.com/320/220/tree,park,nature?lock=${counter}`,
      // pasport timeline eventlari
      events: [
        { date: fmtDate(planted), label: "Ekildi", note: `${p.site}, ${p.mahalla}` },
        { date: fmtDate(new Date(planted.getTime() + 86400000 * 30)), label: "Ro'yxatga olindi", note: p.entered ? "yashilmakon.eco" : "tizimga kiritilmagan" },
        { date: fmtDate(cared), label: "Sug'orildi / parvarish", note: TREE_HEALTH[health].label },
      ],
    };
  });
});

export const treeSummary = (() => {
  const total = TREES.length;
  const healthy = TREES.filter((t) => t.health === "healthy").length;
  const weak = TREES.filter((t) => t.health === "weak").length;
  const dead = TREES.filter((t) => t.health === "dead").length;
  const entered = TREES.filter((t) => t.entered).length;
  const avgHeight = Math.round(TREES.reduce((s, t) => s + t.height, 0) / total);
  return {
    total, healthy, weak, dead,
    healthyPct: Math.round((healthy / total) * 100),
    enteredPct: Math.round((entered / total) * 100),
    avgHeight,
  };
})();

// Tur bo'yicha donut
export const TREES_BY_TYPE = Object.keys(TREE_TYPE).map((key) => ({
  key,
  value: TREES.filter((t) => t.type === key).length,
}));
