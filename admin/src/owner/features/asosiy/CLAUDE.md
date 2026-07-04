# Asosiy modul — Chinobod shaharchasi interaktiv xaritasi

## Umumiy tavsif

- Asosiy modul to'liq ekranni qoplagan, butun sahifa (full-screen) bo'ladi.
- Sahifa Chinobod shaharchasining (Baliqchi tumani) interaktiv xaritasidan iborat.
- Sahifa juda katta monitorda ko'rsatiladi — shu sababli elementlar ko'proq joylashtirilishi kerak.
- Default font size: 10px - 12px (maksimum).

## Xarita (3D — MapLibre GL + OpenStreetMap)

- Xarita MapLibre GL orqali 3D ko'rinishda chiziladi — markaz: **Chinobod shaharchasi, Baliqchi tumani**
  (40.879317, 71.934255). Token kerak emas.
- Basemap: OpenFreeMap (OSM vector tile'lar). OSM'da Chinobod binolari chizilmagan (bbox'da 13 ta),
  shuning uchun uylar real OSM ko'chalari bo'ylab deterministik generatsiya qilingan —
  statik `data/chinobodBuildings.geojson` (~1.5k bino, 13 tasi real OSM).
- GeoJSON'ni yangilash: `node scripts/generate-chinobod-buildings.mjs` (Overpass'dan ko'cha/landuse oladi).
- Xarita orqa fonda to'liq ravishda qoplanadi (`yer` moduli patterni: `mapConfig`/`mapLayers`/`mapInteractions`).
- Xaritani erkin zoom/pan/orbit qilish mumkin. Tanlangan bino oqaradi (feature-state).

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
