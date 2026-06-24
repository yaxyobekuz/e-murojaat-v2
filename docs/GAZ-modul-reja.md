# GAZ moduli — gazlashtirish + gaz balon ta'minoti (batafsil reja)

> Maqsad: mahalla/ko'cha darajasida **gaz ta'minoti** manzarasini ko'rsatish. Ikki
> yo'nalish bitta modulda:
> 1. **Gaz balon (LPG)** — quvur o'tmagan ko'chalarga balon yetkaziladi. Qaysi ko'chaga
>    qancha, qaysisiga kelmay qo'ydi, yetkazish davrlari, oilaga/kishiga o'rtacha balon,
>    doimiy ta'minlanayotganlar, eng tez/eng uzoq yetkazish.
> 2. **Gazlashtirish (quvur)** — quvur o'tgan ko'chalar, gazlashtirish foizi, quvurdagi
>    muammolar, o'rtacha tiklash muddati, ishlash davri (uptime).

> Analitika sahifasiga kirilganda — **gaz / balon effektini** beradigan tematik dashboard
> (ko'k-siyohrang accent + alanga/balon vizuali). **Oshirib yuborilmaydi:** 2 sahifa,
> ~10-12 vizualizatsiya. Demo: Sarnovul MFY, Baliqchi tumani, Andijon. Matn — o'zbekcha.

---

## 0. Joylashuv va konvensiyalar (mavjud kodbazaga moslab)

- **Feature:** `admin/src/owner/features/gaz/` (FSD: `api/ hooks/ components/ pages/ mock/ index.js`).
- **Marshrut bazasi:** `/owner/gaz`. Ikki tab-sahifa:
  - `Analitika` → `/owner/gaz` (asosiy dashboard, gaz effektli)
  - `Ko'chalar` → `/owner/gaz/kochalar` (ko'cha reyestri: ta'minot holati + yetkazish davri + muammolar)
- **Ro'yxatga olish (4 nuqta):** `routes/index.jsx`, `navigation/sidebar.config.js`,
  `layout/topbar.config.js`, `lib/query/keys.js`. **qk.gaz allaqachon bor** (`analytics` kaliti
  mavjud) — uni qayta ishlatamiz, faqat `streets: (params)=>["gaz","streets",params]` qo'shiladi.
- **Accent rangi:** **ko'k-siyohrang `#1E4FD8`** (rules/02 da Gaz → blue) + alanga uchun cyan/amber.
- **DRY:** `shared/components/ui/glass/*`, `shared/components/ui/chart/*` (TrendChart, DonutChart,
  BreakdownBar, StackedBar, ComboChart — endi theme-aware), `table/DataTable`, `select/Select`.
  Feature-lokal yangi: `SupplyHeatmap` (ko'cha status gridi), `RepairGauge`, `GasHero` (effekt).

---

## 1. Status va ta'minot turlari (kod + o'zbekcha)

**Ta'minot turi (`supplyType`):**
```
quvur    → "Quvur gazi"          (gazlashtirilgan)
balon    → "Gaz balon"           (LPG yetkaziladi)
aralash  → "Aralash"             (qisman quvur + balon)
yoq      → "Gaz yo'q"            (na quvur, na muntazam balon)
```

**Ta'minot holati (`status`) — rang xaritasi:**
```
yashil → "Doimiy ta'minlangan"   #10b981   (muntazam, yetarli)
sariq  → "Kam / kechikishli"     #f59e0b   (uzilishlar, kam balon)
qizil  → "Ta'minot to'xtagan"    #ef4444   (kelmay qo'ygan / jiddiy muammo)
qora   → "Deyarli yo'q"          #1f2937   (gaz umuman yetib bormaydi)
```

**Yetarlilik (`adequacy`):** `yetarli` / `kam` / `deyarli_yoq`.
**Yetkazish holati (delivery):** `yetkazildi` / `kechikdi` / `yetkazilmadi`.
**Quvur muammosi turi (`incidentType`):** `sizish` / `bosim_pastligi` / `uzilish` / `hisoblagich`.

---

## 2. Ma'lumotlar modeli

### 2.1 `Street` (ko'cha) — `mock/gaz.data.js`
| Maydon | Izoh |
|---|---|
| `id`, `name` | "Sarnovul", "Navoiy", ... |
| `households` | xonadonlar soni |
| `population` | aholi (kishiga o'rtacha hisob uchun) |
| `supplyType` | quvur / balon / aralash / yoq |
| `status` | yashil / sariq / qizil / qora |
| **Balon** | |
| `cylindersPerMonth` | oyiga yetkazilgan balon soni |
| `cylindersNeeded` | oyiga kerakli balon (ta'minot foizi shu orqali) |
| `avgCylindersPerFamily` | oilaga o'rtacha balon (oy) |
| `deliveryCycleDays` | o'rtacha yetkazish davri (kun) |
| `longestGapDays` | eng uzoq uzilish (kun) |
| `lastDeliveryDate` | oxirgi yetkazilgan sana |
| `supplierId` | doimiy yetkazib beruvchi (yoki null) |
| **Quvur** | |
| `gasifiedPct` | gazlashtirilgan xonadon ulushi |
| `pipelineKm` | quvur uzunligi |
| `openIncidents` | ochiq muammolar soni |
| `avgRepairH` | o'rtacha tiklash vaqti (soat) |
| `uptimePct` | quvur ishlash davri (%) |

> Hosilalar: `coveragePct = cylindersPerMonth / cylindersNeeded`, `perCapita = cylinders/population`.
> Status `coveragePct`+`uptimePct`+`supplyType` dan kelib chiqadi (qora = yoq, qizil = past coverage...).

### 2.2 `Delivery` (yetkazib berish) — `mock/gaz.deliveries.js`
`{ id, streetId, date, cylinders, supplierId, status }` — 12 oy tarix, har ko'cha uchun
davriy yetkazishlar (deliveryCycleDays bo'yicha), ba'zilari `kechikdi`/`yetkazilmadi`.

### 2.3 `Incident` (quvur muammosi) — `mock/gaz.incidents.js`
`{ id, streetId, type, reportedAt, resolvedAt, durationH, status }` — faqat quvur/aralash
ko'chalar uchun. O'rtacha tiklash muddati va ishlash davri shulardan.

### 2.4 `Supplier` (yetkazib beruvchi) — ~5-6 ta
`{ id, name, reliability }` — "doimiy ta'minlovchilar" statistikasi uchun.

---

## 3. Mock strategiya — `mock/gaz.*.js`

- **~14 ko'cha** (Sarnovul ko'chalari). Status taqsimoti: ~40% yashil, ~28% sariq,
  ~22% qizil, ~10% qora. Ta'minot turi: ~45% quvur, ~30% balon, ~15% aralash, ~10% yo'q.
- **Yetkazishlar:** har balon/aralash ko'cha uchun 12 oy davomida davriy yozuvlar
  (cikl ± tasodif), ba'zi oylarda `yetkazilmadi` (qizil ko'chalar). Mavsumiylik: qishda
  talab/yetkazish yuqori (isitish), yozda past.
- **Muammolar:** quvur ko'chalarda yiliga bir nechta incident, qishda ko'proq.
- Seedlangan PRNG (barqaror demo). API façade (`gaz.api.js`) — yer/elektr/msk shaklida.

---

## 4. Sahifa 1 — **Analitika** (`/owner/gaz`) — gaz/balon effektli

### 4.1 Gaz effekti (GasHero)
Tepada ko'k-siyohrang gradient hero kartasi: **animatsion alanga** (CSS, subtil) + balon
ikonkasi/illyustratsiyasi + asosiy raqam (gazlashtirish foizi). Glow effekti. Oshirilmaydi —
bitta sokin hero.

### 4.2 Global filtr paneli (mix)
`ko'cha`, `ta'minot turi`, `holat (yashil/sariq/qizil/qora)`, `yetarlilik`, `davr` —
barcha grafiklarga ta'sir qiladi.

### 4.3 KPI qatori (4-5 ta)
- Gazlashtirilgan xonadonlar % (quvur)
- Oylik yetkazilgan balonlar (jami)
- O'rtacha yetkazish davri (kun)
- Doimiy ta'minlanayotgan ko'chalar % (yashil)
- O'rtacha tiklash vaqti (soat) — quvur muammolari

### 4.4 Grafiklar — har biri savolga javob (~10-12)
| # | Savol | Grafik |
|---|---|---|
| 1 | Qaysi ko'cha qaysi holatda? | **SupplyHeatmap** (ko'cha grid, 4 rang) |
| 2 | Balon yetkazish dinamikasi (kerakli vs yetkazilgan)? | **ComboChart** 12 oy |
| 3 | Ta'minot holati taqsimoti? | **DonutChart** (yashil/sariq/qizil/qora) |
| 4 | Ta'minot turi ulushi (quvur/balon/aralash/yo'q)? | **DonutChart** |
| 5 | Ko'cha bo'yicha yetkazilgan balon (eng ko'p/kam)? | **BreakdownBar** |
| 6 | O'rtacha yetkazish davri ko'cha bo'yicha (eng tez/eng uzoq)? | **BreakdownBar** |
| 7 | Yetarlilik (yetarli/kam/deyarli yo'q)? | **DonutChart** |
| 8 | Oilaga/kishiga o'rtacha balon? | **BreakdownBar** (ko'cha) yoki KPI |
| 9 | Gazlashtirish qoplami (quvur vs balon vs yo'q)? | **StackedBar** yoki Donut |
| 10 | Quvur muammolari dinamikasi (oy bo'yicha)? | **TrendChart / ComboChart** |
| 11 | O'rtacha tiklash vaqti / uptime? | **RepairGauge** (gauge) |
| 12 | Doimiy yetkazib beruvchilar ulushi? | **DonutChart** (supplier) |

### 4.5 Insight matnlari
Har grafik ostida 1 qatorli izoh (masalan: "3 ko'cha — qizil: balon 2 oydan beri kelmagan").

---

## 5. Sahifa 2 — **Ko'chalar** (`/owner/gaz/kochalar`)

- **Filtr** (xuddi global) + qidiruv.
- **DataTable** (glass) ustunlari: Ko'cha, Ta'minot turi (chip), Holat (badge: yashil/sariq/qizil/qora),
  Xonadon, Oylik balon, Kerakli, Ta'minot %, O'rtacha davr (kun), Eng uzoq uzilish,
  Gazlashtirish %, Ochiq muammo, O'rt. tiklash (soat), Uptime %.
- Qatorni bosish → **tafsilot modal** (`MODAL.GAZ_STREET_DETAIL`): ko'cha bo'yicha
  yetkazish tarixi (oxirgi yetkazishlar) + quvur muammolari ro'yxati + ko'rsatkichlar.
- Rang kodlari: qizil/qora ko'chalar darhol ko'zga tashlanadi.

---

## 6. Fayl tuzilmasi (yaratiladigan)

```
admin/src/owner/features/gaz/
├─ index.js                       # GazAnalyticsPage, GazStreetsPage
├─ api/gaz.api.js                 # façade (streets, street, deliveries, analytics)
├─ hooks/
│  ├─ useGazStreets.js
│  └─ useGazAnalytics.js
├─ mock/
│  ├─ gaz.data.js                 # ko'chalar, suppliers, status/turi xaritalari
│  ├─ gaz.deliveries.js           # yetkazish yozuvlari (12 oy)
│  ├─ gaz.incidents.js            # quvur muammolari
│  └─ gaz.analytics.js            # summary + barcha kesimlar (filtr bilan)
├─ utils/gaz.filters.js           # filterSortPaginate
├─ components/
│  ├─ GazHero.jsx                 # gaz/balon effektli hero (alanga + glow)
│  ├─ GazFilters.jsx              # global filtr paneli
│  ├─ KpiStrip.jsx                # 4-5 GlassStatCard
│  ├─ SupplyHeatmap.jsx           # ko'cha holati gridi (4 rang)
│  ├─ RowSupply.jsx               # delivery combo + status donut + turi donut
│  ├─ RowStreets.jsx              # ko'cha bo'yicha balon + yetkazish davri bar
│  ├─ RowPipeline.jsx             # gazlashtirish stacked + muammolar trend + RepairGauge
│  ├─ StreetTable.jsx             # ko'chalar jadvali
│  ├─ charts/
│  │  ├─ chartTheme.js            # gaz palitra (ko'k/cyan)
│  │  └─ RepairGauge.jsx          # tiklash vaqti / uptime gauge
│  └─ modals/
│     └─ StreetDetailModal.jsx    # ko'cha tafsiloti + yetkazish/muammo tarixi
└─ pages/
   ├─ GazAnalyticsPage.jsx
   └─ GazStreetsPage.jsx
```

> Komponentlar 150 qatordan oshmaydi. Modal `ModalWrapper` orqali (`MODAL.GAZ_STREET_DETAIL`).
> CSS alanga animatsiyasi — `styles/index.css` ga kichik `@keyframes gaz-flame` (subtil).

---

## 7. `qk` va modal

```js
// keys.js — qk.gaz ga qo'shiladi (analytics allaqachon bor)
streets: (params) => ["gaz", "streets", params],
```
```js
// modals.js
GAZ_STREET_DETAIL: "gaz:streetDetail",
```
`analytics` kind lar: `summary | deliveryTrend | byStatus | bySupplyType | cylindersByStreet |
cycleByStreet | adequacy | coverage | incidentsTrend | repair | suppliers | perFamily`.

---

## 8. Dizayn (rules/02 ga mos)

- Ko'k-siyohrang accent (#1E4FD8). Status badge: yashil=done, sariq=progress, qizil=danger,
  qora=neutral (to'q). Gaz effekti subtil (bitta hero alanga + glow), qichqirган emas.
- Theme-aware grafiklar (yangi `useChartColors`), tabular-nums, sana DD.MM.YYYY.
- Skeleton/empty-state/toast. Heatmap'da 4 rang aniq.

---

## 9. Ishlash tartibi va DoD

**Tartib:** mock (data→deliveries→incidents→analytics) → API+hooks+qk → ro'yxatga olish →
Ko'chalar sahifasi → Analitika sahifasi (hero+KPI+grafiklar) → sayqal → lint+build+demo.

**Tayyor (DoD):**
- [ ] Mock: ~14 ko'cha, 12 oy yetkazish + muammolar, barcha maydonlar, real Sarnovul ohangi.
- [ ] Analitika: hero (gaz effekti) + 4-5 KPI + 10-12 grafik + global mix filtr + insightlar.
- [ ] Ko'chalar: jadval + filtr + qidiruv + tafsilot modal (yetkazish/muammo tarixi).
- [ ] Savollar qoplandi: qaysi ko'chaga qancha balon, qaysisi kelmay qo'ydi, yetkazish
      davrlari (eng tez/uzoq), oilaga/kishiga o'rtacha, doimiy ta'minlovchilar, gazlashtirish %,
      quvur muammolari + tiklash muddati, statuslar (yashil/sariq/qizil/qora).
- [ ] Dizayn rules/02 ga mos; `npm run lint` toza, `npm run build` o'tadi.

**Demo:** MFY → Gaz → Analitika: hero gazlashtirish % → SupplyHeatmap'da qizil/qora ko'chalar →
filtrda "balon + qizil" → grafiklar mix bo'yicha qayta hisoblanadi → Ko'chalar → qizil ko'cha
modalida "2 oydan beri yetkazilmadi" tarixi.
