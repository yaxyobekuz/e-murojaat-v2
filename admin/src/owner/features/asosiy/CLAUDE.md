# Asosiy modul — Sarnovul MFY interaktiv xaritasi

## Umumiy tavsif

- Asosiy modul to'liq ekranni qoplagan, butun sahifa (full-screen) bo'ladi.
- Sahifa Sarnovul MFY (Chinobod hududi, Baliqchi tumani) interaktiv xaritasidan iborat.
- Barcha ko'rsatkichlar sarnovul moduli bilan mos: 763 xonadon / 4 306 aholi / 13 korxona / 14 ko'cha (`mahallaData.js`).
- Sahifa juda katta monitorda ko'rsatiladi — shu sababli elementlar ko'proq joylashtirilishi kerak.
- Default font size: 10px - 12px (maksimum).

## Xarita (3D — MapLibre GL + OpenStreetMap)

- Xarita MapLibre GL orqali 3D ko'rinishda chiziladi — markaz: **Chinobod shaharchasi, Baliqchi tumani**
  (40.879317, 71.934255). Token kerak emas.
- Basemap: OpenFreeMap (OSM vector tile'lar). Barcha obyektlar **faqat OSM'da real chizilganlar**
  (generatsiya yo'q): binolar 3D, landuse (dala/qabriston/sanoat/turar-joy...), yo'llar, suv.
- Jonli yangilanish: `data/liveOsm.js` — Overpass'dan har 60s; OSM editor'da chizilgan obyekt
  ~1-2 daqiqada xaritada chiqadi. Boshlang'ich render: `data/chinobodOsm.geojson` snapshot
  (`node scripts/fetch-chinobod-osm.mjs` bilan yangilanadi, bbox — `mapConfig.MAP_BBOX`).
- Feature type → element turi: building→uy (industrial/warehouse→zavod), landuse farmland/grassland/orchard→dala
  (industrial→zavod), highway→yol. Kartochkada OSM'da kiritilgan real ma'lumot ustuvor:
  `name`, `height`, `building:levels` (qavat), poligon maydoni, yo'l uzunligi (`osmElement.js`).
- Xarita orqa fonda to'liq ravishda qoplanadi (`yer` moduli patterni: `mapConfig`/`mapLayers`/`mapInteractions`).
- Xaritani erkin zoom/pan/orbit qilish mumkin. Tanlangan bino oqaradi (feature-state).

## Xonadon ma'lumotlari (server)

- Minimal backend: `server/` (Express, port 8032, auth yo'q) — `data/houses.json` faylida saqlaydi.
  Ishga tushirish: `cd server && npm install && npm run dev`. API: `GET/PUT/DELETE /api/houses/:osmId`.
- Kalit — **OSM bino id** (`osmId`, Overpass'dagi way id, `liveOsm.js` binolarga qo'shadi).
- **Dashboardda tahrirlash YO'Q** — u faqat ko'rsatadi. Kiritish/tahrirlash alohida yopiq sahifada:
  **`/owner/xonadonlar`** (`pages/XonadonlarPage.jsx`, dashboardda havolasi yo'q) — barcha OSM
  binolar jadvali (qidiruv + kiritilgan/kiritilmagan filtri) + `HouseEditModal` (nom, egasi,
  telefon, a'zolar, mulkchilik, manzil, izoh) + o'chirish.
- Saqlangan yozuv dashboardda mock kartani ustidan yozadi: sarlavha + reyestr faktlari, "REAL"
  belgisi va "real ma'lumot" footer. Server o'chiq bo'lsa panel mock rejimda ishlayveradi.
- Hooklar: `useHouseQuery(osmId)` / `useHousesQuery()` / `useHouseMutation` (`qk.houses`).
- Ma'lumotli uylar xaritada **oltin** rangda (`real` feature-state). To'liq stack: `npm run dev:full`.

## Elementlar

- Binoga bosilganda `buildingElement` real binodan barqaror "element" yasaydi (id koordinatadan hash).
- Bino balandlik/yuzasiga qarab tur oladi: katta/baland → `zavod`, qolganlari → `uy`.
- `elementData.elementInfo` shu turdan deterministik mock kartochka generatsiya qiladi.
- Tanlangan elementning batafsil ma'lumoti o'ng panelda ko'rsatiladi.

## Holatlar

1. Hech qanday element belgilanmaganda
   - Andijon shahrining umumiy ma'lumotlari ko'rinib turishi kerak.
2. Element belgilanganda
   - O'ng tomonning yarmida element to'g'risida juda ko'plab statistika va ma'lumotlar ko'rsatiladi.

## Top bar — cardlar

- Top barda cardlar joylashadi, har bir card modul bo'yicha ma'lumot ko'rsatadi.
- Tartib: 2 qator, 8 ustun — jami 16 ta card.
- Cardlardagi modullar:
  1. Aholi soni
  2. Soliq
  3. Ta'lim
  4. Yoshlar
  5. IIB
  6. Gaz
  7. Obodonlashtirish
  8. Suv
  9. Elektr
  10. Yer kadastri

## Bottom bar

- Pastda yana qo'shimcha ma'lumotlar ko'rinib turishi kerak.

## Dizayn talablari

- Sahifa juda ajoyib bo'lishi kerak: wow effektlar.
- Kreativ va silliq animatsiyalar bo'lishi kerak.
