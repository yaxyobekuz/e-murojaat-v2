# MSK — Mahalla Servis Kompaniyasi moduli (batafsil reja)

> Maqsad: mahalla aholisi maishiy xizmatlar uchun **ariza** beradi (ariq tozalash,
> santexnik, elektrik, tom yopish va h.k.). MSK mas'ul xodimlari shu yo'nalish bo'yicha
> **ishchi tayinlaydi**, ijro muddati belgilanadi va ish yopiladi. Har bir ariza —
> boy ma'lumotli yozuv (demografiya, manzil, xodim, muddat, baho...). Shular asosida
> **"wow" analitika** sahifasi quriladi: har qanday savolga raqam + diagramma bilan javob.

> **Demo konteksti:** Sarnovul MFY, Baliqchi tumani, Andijon. Barcha matn — o'zbekcha,
> kod qiymatlari — inglizcha (`.claude/rules/01`). Dizayn — `.claude/rules/02` (glass tizimi).

---

## 0. Modul joylashuvi va konvensiyalar (mavjud kodbazaga moslab)

> **MUHIM:** Frontend `admin/src/` da (CLAUDE.md `client/` deydi — eskirgan).
> Bu modul boshqa modullar kabi **faqat frontend, mock asosida** (yer/elektr kabi `*.api.js`
> façade — kelajakda real backendga ulash uchun shakl saqlanadi).

- **Feature papkasi:** `admin/src/owner/features/msk/` (FSD: `api/ hooks/ components/ pages/ mock/ index.js`).
- **Marshrut bazasi:** `/owner/msk`. Ikki sahifa (topbar/sidebar "tab" lari):
  - `Analitika`  → `/owner/msk` (asosiy dashboard)
  - `Arizalar`   → `/owner/msk/arizalar` (jadval + filtr + CRUD + tafsilot modal)
- **Ro'yxatga olish (4 nuqta):**
  1. `admin/src/owner/routes/index.jsx` — 2 ta `<Route>`.
  2. `admin/src/owner/navigation/sidebar.config.js` — `key:"msk"` moduli, 2 ta item.
  3. `admin/src/shared/components/layout/topbar.config.js` — `key:"msk"`, `base:"/owner/msk"`, 2 item.
  4. `admin/src/shared/lib/query/keys.js` — `qk.msk` registri.
- **Modul accent rangi:** **`rose` (atirgul, `#f43f5e`)** — hozircha bo'sh (yer=emerald, gaz=blue,
  svet/elektr=amber, murojaat=violet, soliq=indigo, obod=teal, yoshlar=orange). Ikonka/badge/chart
  uchun. Glass KPI kartalar mavjud accentlardan (`purple/yellow/cyan/emerald`) foydalanadi.
- **Qayta ishlatish (DRY):** `shared/components/ui/glass/*` (GlassCard, GlassStatCard, GlassChartCard,
  GlassStatusBadge, DeltaPill), `shared/components/ui/chart/*` (TrendChart, DonutChart, BreakdownBar,
  StackedBar, ComboChart), `shared/components/ui/table/DataTable`, `shared/components/ui/select/Select`,
  `shared/components/ui/tabs/*`, `shared/utils/{calculateAge,formatDate,date.utils,formatMoney}`.
  Yangi chart kerak bo'lgandagina feature-lokal `components/charts/*` yoziladi.

---

## 1. Kategoriyalar (18 ta) — kod + o'zbekcha yorliq

```
ariq_tozalash      → "Ariq tozalash"
boyoq_ishlari      → "Bo'yoq ishlari"
chiroq_ornatish    → "Chiroq o'rnatish"
daraxt_kesish      → "Daraxt kesish"
devor_suvoq        → "Devor suvoq"
elektrik           → "Elektrik xizmatlari"
issiqlik_tizimi    → "Issiqlik tizimi"
kichik_qurilish    → "Kichik qurilish"
metall_konstruksiya→ "Metall konstruksiya"
obodonlashtirish   → "Obodonlashtirish"
payvandlash        → "Payvandlash"
qor_tozalash       → "Qor tozalash"
qulflash           → "Qulflash xizmatlari"
santexnik          → "Santexnik xizmatlari"
suv_quvur_tamiri   → "Suv quvur ta'miri"
tamirlash          → "Ta'mirlash ishlari"
tom_yopish         → "Tom yopish"
uy_tozalash        → "Uy tozalash"
```

Har kategoriyaga: `icon` (lucide), `accent`, `avgCostUzs` (o'rtacha narx oralig'i),
`avgDurationH` (o'rtacha ijro soati), `seasonal` (mavsumiylik koeffitsienti — `qor_tozalash`
qishda, `ariq_tozalash`/`obodonlashtirish` bahor-yozda cho'qqi).

---

## 2. Ma'lumotlar modeli — `Appeal` (ariza) — BARCHA maydonlar

Bir ariza yozuvi (`mock/msk.appeals.js` da generatsiya qilinadi):

| Maydon | Tur | Izoh |
|---|---|---|
| `id` | string | `msk_0001` |
| `appealNumber` | string | `MSK-2026-00123` (kuzatuv raqami) |
| `createdAt` | ISO date | ariza tushgan sana (12 oy tarix) |
| `status` | enum | `yangi` / `tayinlandi` / `jarayonda` / `bajarildi` / `bekor` / `kechikkan` |
| `category` | enum | 18 kategoriyadan biri |
| `priority` | enum | `past` / `orta` / `yuqori` / `shoshilinch` |
| `description` | string | tabiiy o'zbekcha izoh (pastga qarang) |
| **Arizachi (fuqaro)** | | |
| `applicant.name` | string | o'zbekcha ism (F.I.Sh qisqa) |
| `applicant.gender` | enum | `erkak` / `ayol` |
| `applicant.age` | number | 18–82 |
| `applicant.phone` | string | `+998 9X XXX XX XX` (mock) |
| **Manzil** | | |
| `address.mahalla` | string | "Sarnovul MFY" (demoda barchasi) |
| `address.street` | string | Sarnovul ko'chalari ro'yxatidan |
| `address.house` | string | `12`, `45/2` |
| **Ijro** | | |
| `assignedWorker` | obj/null | `{ id, name, gender, specialty }` — tayinlangan xodim |
| `assignedAt` | ISO/null | tayinlangan vaqt |
| `deadline` | ISO/null | ijro muddati (tayinlashda belgilanadi) |
| `completedAt` | ISO/null | yakunlangan sana |
| `durationH` | number/null | ijro davomiyligi (soat) = completed − assigned |
| `slaMet` | bool/null | muddatida bajarildimi (`completedAt <= deadline`) |
| `costUzs` | number/null | xizmat narxi |
| `rating` | 1–5 / null | fuqaro bahosi (bajarilgan arizalarga) |
| `source` | enum | `mobil_ilova` / `call_markaz` / `mfy_rais` / `veb` |
| `events[]` | array | timeline: `{ at, type, note }` (yangi→tayinlandi→jarayonda→bajarildi) |

**Tabiiy izoh (description) misollari** (Sarnovul darajasida, real ohang):
- "Hovli oldidagi ariq loyqa bilan to'lib qolgan, suv o'tmayapti. Iltimos tozalab bering."
- "Uyning tomidan suv o'tyapti, shifer ko'chgan. Yomg'irdan oldin ta'mirlash kerak."
- "Ko'cha chiroqlari 3 kundan beri yonmayapti, kechqurun qorong'i."
- "Hammomda truba teshilgan, suv oqyapti. Tezroq santexnik yuboring."
- "Darvoza qulfi singan, ochilmayapti."
- "Qor bosib qoldi, mahalla ichidagi yo'lni tozalash kerak."

> Izohlar **kategoriyaga mos** shablon to'plamidan + ko'cha/uy bilan tabiiy aralashtiriladi
> (seedlangan PRNG → barqaror). Har kategoriya uchun 5–8 ta shablon.

---

## 3. Ma'lumotnoma (reference) — `mock/msk.data.js`

- **STREETS** (Sarnovul ko'chalari, ~14 ta): "Sarnovul", "Navoiy", "Bobur", "A.Temur",
  "Fidokor", "Istiqlol", "Do'stlik", "Bog'", "Chinor", "Guliston", ...
- **WORKERS** (xodimlar reestri, ~24–30 ta): `{ id, name, gender, specialties[] }` —
  har xodim 1–3 kategoriya bo'yicha. Jins taqsimoti real (ko'pchilik erkak, lekin
  `uy_tozalash`, `boyoq_ishlari` da ayollar ham). Ariza tayinlanganda xodim shu
  kategoriya `specialties` ichidan tanlanadi → "qaysi xodim qaysi yo'nalishda" statistikasi.
- **STATUS / PRIORITY / SOURCE / GENDER** xaritalari (label + tone + color).
- **AGE_BUCKETS**: `18-25`, `26-35`, `36-45`, `46-60`, `60+` (yosh kesimi grafiklar uchun).
- **Sana yordamchilari**: `shared/utils/date.utils`, `calculateAge`, `formatDate` ishlatiladi.

---

## 4. Mock generatsiya strategiyasi — `mock/msk.appeals.js`

- **Hajm:** ~720 ariza, **12 oy tarix** (har oy ~60, mavsumiy tebranish bilan).
- **Seedlangan PRNG** (mulberry32) → reload'da barqaror demo.
- **Mavsumiylik:** `qor_tozalash` faqat qish (Dek–Fev) cho'qqi; `ariq_tozalash`,
  `obodonlashtirish`, `daraxt_kesish` bahor-yoz; `issiqlik_tizimi` kuz-qish.
- **Status taqsimoti:** ~58% `bajarildi`, ~14% `jarayonda`, ~10% `tayinlandi`,
  ~8% `yangi`, ~6% `kechikkan`, ~4% `bekor`.
- **Demografiya:** yosh normal taqsimot (cho'qqi 30–50), jins ~63% erkak / 37% ayol
  arizachi (ataylab ba'zi kategoriyalarda ayol ko'p — `uy_tozalash`).
- **Ijro vaqti:** `durationH` kategoriya `avgDurationH` atrofida; `slaMet` ~76%.
- **Baho:** bajarilganlarga 1–5 (o'rtacha ~4.3, ba'zi pastlar bilan).
- **Narx:** kategoriya `avgCostUzs` oralig'ida.
- **events[]:** har status o'zgarishi uchun timeline yozuvi (sana + o'zbekcha note).
- **API façade** (`api/msk.api.js`): `appeals(params)` (filtr+sort+pagination),
  `appeal(id)`, `analytics(kind, params)` — yer/elektr `*.api.js` shaklida (`ok()` delay).

---

## 5. Sahifa 1 — **Arizalar** (`/owner/msk/arizalar`)

- **Filtr paneli:** kategoriya, status, jins, yosh kesimi, ko'cha, manba, sana oralig'i,
  ustuvorlik, mas'ul xodim + **qidiruv** (raqam/ism/manzil). Hammasi birga ishlaydi
  (mix). `useObjectState` bilan.
- **DataTable** (glass variant) ustunlari: Ariza №, Sana, Kategoriya (rangli chip),
  Arizachi (ism + jins ikonkasi + yosh), Ko'cha/uy, Mas'ul xodim, Holat (badge),
  Ijro muddati (deadline, kechikkan=qizil), Baho (yulduz), Ustuvorlik.
- **Qatorni bosish → tafsilot modal** (`ModalWrapper`, `shared/constants/modals.js`):
  to'liq ma'lumot + **timeline** (events) + status o'zgartirish + **xodim tayinlash**
  (kategoriyaga mos xodimlar select) + muddat belgilash. (Demo: lokal state CRUD.)
- **Pagination** (`shared/components/ui/pagination`).
- **Yuqorida mini-KPI**: tanlangan filtr bo'yicha jami / bajarildi / jarayonda / kechikkan.

---

## 6. Sahifa 2 — **Analitika** (`/owner/msk`) — "WOW" dashboard

> Tartib: `rules/02` — tepada filtr paneli → KPI qatori → grafiklar gridi (2 ustun) →
> pastda kesim jadvali. Har grafik tepasida 1 qatorli **insight** matni.
> **Global filtr paneli** (kategoriya, jins, yosh, ko'cha, status, sana) — **barcha**
> grafiklarga ta'sir qiladi (mix/aralashtirish).

### 6.1 KPI qatori (GlassStatCard, 4–6 ta)
- Jami arizalar (delta)
- Bajarilish darajasi % (bajarildi / jami)
- O'rtacha ijro vaqti (soat/kun)
- SLA (muddatida bajarish) %
- Faol xodimlar soni / band xodimlar
- O'rtacha fuqaro bahosi (★)

### 6.2 Grafiklar — har biri aniq SAVOLGA javob

| # | Savol | Grafik turi | Ma'lumot |
|---|---|---|---|
| 1 | Qaysi xizmat eng ko'p so'ralyapti? | **BreakdownBar** (kategoriya) | ariza soni / kategoriya |
| 2 | Arizalar oylar bo'yicha qanday o'zgaryapti? | **TrendChart / ComboChart** | 12 oy: tushgan vs bajarilgan |
| 3 | Holatlar taqsimoti (funnel)? | **DonutChart** + **funnel** | status bo'yicha |
| 4 | **Jins bo'yicha** kim ko'proq ariza beryapti? | **DonutChart** | erkak/ayol arizachi |
| 5 | **Jins bo'yicha** kim ko'proq ish bilan bandlik (xodim)? | **StackedBar** | xodim jinsi × kategoriya |
| 6 | **Yosh kesimida** kim ko'p ariza beradi? | **BreakdownBar** | yosh bucket × ariza |
| 7 | Yosh × kategoriya (kim nimani so'raydi)? | **Heatmap (custom)** | yosh × kategoriya matritsa |
| 8 | **Qancha vaqtda** ijro yakunlanyapti? | **Histogram / BarChart** | ijro vaqti taqsimoti (0–4soat, ...) |
| 9 | Kategoriya bo'yicha o'rtacha ijro vaqti? | **BreakdownBar** | avg durationH / kategoriya |
| 10 | SLA — muddatida vs kechikkan? | **StackedBar** (oy bo'yicha) | slaMet split |
| 11 | Eng faol/samarali xodimlar reytingi? | **RatingList / BreakdownBar** | xodim × bajarilgan + baho |
| 12 | Ko'cha bo'yicha "issiq nuqtalar"? | **BreakdownBar** | ariza soni / ko'cha |
| 13 | Manba (mobil/call/rais/veb) ulushi? | **DonutChart** | source bo'yicha |
| 14 | Ustuvorlik taqsimoti? | **DonutChart** | priority bo'yicha |
| 15 | Fuqaro mamnuniyati dinamikasi? | **TrendChart** | o'rtacha rating / oy |
| 16 | Mavsumiylik (qaysi xizmat qaysi faslda)? | **StackedBar (oy×kategoriya)** | top kategoriyalar oy bo'yicha |

### 6.3 Aralashtirish (mix / cross-filter)
- **Global filtr paneli** + har grafikda kerakli kesim — masalan: "26–35 yosh **ayollar**
  **santexnik** xizmatiga bergan arizalar, **Navoiy ko'chasi**" — bularning hammasi bir
  vaqtda tanlansa, KPI va barcha grafiklar shu kesim bo'yicha qayta hisoblanadi.
- Grafik ustiga bosib (drill-down) ham filtrga qo'shilishi mumkin (bonus).

### 6.4 Pastda — kesim jadvali
- **Mas'ul xodimlar reytingi jadvali**: xodim, yo'nalish(lar), tayinlangan, bajarilgan,
  o'rtacha vaqt, o'rtacha baho, SLA %. (yoki) **kategoriya kesimi jadvali**.

---

## 7. Fayl tuzilmasi (yaratiladigan)

```
admin/src/owner/features/msk/
├─ index.js                         # public API: MskAnalyticsPage, MskAppealsPage
├─ api/msk.api.js                   # façade (appeals, appeal, analytics)
├─ hooks/
│  ├─ useMskAppeals.js              # ro'yxat (filtr/pagination)
│  ├─ useMskAppeal.js               # bitta ariza
│  └─ useMskAnalytics.js            # analytics(kind, params)
├─ mock/
│  ├─ msk.data.js                   # kategoriyalar, ko'chalar, xodimlar, status/jins/manba xaritalari
│  ├─ msk.appeals.js                # 720 ariza generatsiyasi (seedlangan)
│  ├─ msk.descriptions.js           # kategoriya bo'yicha izoh shablonlari
│  └─ msk.analytics.js              # summary + barcha kesim/aggregatsiya funksiyalari
├─ utils/msk.filters.js             # filterSortPaginate + kesim helperlari
├─ components/
│  ├─ MskFilters.jsx                # global filtr paneli (kategoriya/jins/yosh/ko'cha/status/sana)
│  ├─ KpiStrip.jsx                  # 4–6 GlassStatCard
│  ├─ RowOverview.jsx               # trend + status donut + kategoriya bar
│  ├─ RowDemographics.jsx           # jins donut + yosh bar + yosh×kategoriya heatmap
│  ├─ RowExecution.jsx              # ijro vaqti histogram + SLA stacked + xodim reyting
│  ├─ WorkerTable.jsx               # xodimlar reytingi (DataTable)
│  ├─ AppealsTable.jsx              # arizalar jadvali (DataTable)
│  ├─ AppealFilters.jsx             # arizalar sahifasi filtri
│  ├─ charts/
│  │  ├─ chartTheme.js              # rose accent palitra (theme-aware)
│  │  ├─ AgeCategoryHeatmap.jsx     # yosh×kategoriya matritsa (custom)
│  │  ├─ DurationHistogram.jsx      # ijro vaqti taqsimoti (custom)
│  │  └─ StatusFunnel.jsx           # status funnel (custom)
│  └─ modals/
│     └─ AppealDetailModal.jsx      # tafsilot + timeline + tayinlash/status
└─ pages/
   ├─ MskAnalyticsPage.jsx          # /owner/msk
   └─ MskAppealsPage.jsx            # /owner/msk/arizalar
```

> Komponentlar **150 qatordan oshmaydi** (`rules/01`) — oshsa bo'linadi. Modal faqat
> `ModalWrapper` orqali, nomi `shared/constants/modals.js` dan (`MSK_APPEAL_DETAIL`).

---

## 8. `qk` registri (keys.js ga qo'shiladi)

```js
msk: {
  all: () => ["msk"],
  appeals: (params) => ["msk", "appeals", params],
  appeal: (id) => ["msk", "appeal", id],
  analytics: (kind, params) => ["msk", "analytics", kind, params],
},
```

`analytics` kind lari: `summary | timeseries | byCategory | byStatus | byGender |
workerGender | byAge | ageCategory | durationHist | durationByCategory | sla |
workers | byStreet | bySource | byPriority | satisfaction | seasonal`.

---

## 9. Dizayn (rules/02 ga mos)

- Glass tizimi (light default, dark ixtiyoriy). MSK accent — **rose `#f43f5e`**.
- Status badge xaritasi: `yangi`=ko'k, `tayinlandi`=siyohrang, `jarayonda`=amber,
  `bajarildi`=yashil, `bekor`=kulrang, `kechikkan`=qizil-outline.
- Raqamlar `tabular-nums`, pul `formatMoney` (so'm), sana `formatDate` (DD.MM.YYYY).
- Yuklanish — **skeleton**, xato/muvaffaqiyat — **toast**. Bo'sh ma'lumot — EmptyState.
- Diagrammalar yumshoq ranglar, tooltip formatlangan, mavsumiy grafiklarда legenda.

---

## 10. Bosqichma-bosqich ishlash tartibi (implement qilishda)

1. **Mock** (`msk.data.js` → `msk.descriptions.js` → `msk.appeals.js` → `msk.analytics.js`)
   — ma'lumot bo'lmasa UI qurilmaydi. Node bilan summary'ni tekshirish.
2. **API façade + hooks** + `qk.msk`.
3. **Ro'yxatga olish** (routes, sidebar, topbar) — bo'sh sahifalar bilan smoke-test.
4. **Arizalar sahifasi** (jadval + filtr + tafsilot modal).
5. **Analitika sahifasi** (KPI → grafik qatorlari → kesim jadvali → global filtr mix).
6. **Sayqal**: insight matnlari, skeleton, accent, responsive grid.
7. `lint` + `build` + dev'da demo oqimini boshdan-oxir tekshirish.

---

## 11. "Tayyor" mezoni (Definition of Done — `rules/03`)

- [ ] Mock: ~720 ariza, 12 oy tarix, barcha maydonlar (demografiya, manzil, xodim, muddat,
      baho, narx, timeline), Sarnovul darajasidagi tabiiy o'zbekcha izohlar.
- [ ] **Arizalar sahifasi**: jadval + ko'p o'lchovli filtr + qidiruv + pagination +
      tafsilot modal (timeline + xodim tayinlash + status).
- [ ] **Analitika sahifasi**: 4–6 KPI + 14+ grafik (yuqoridagi savollar jadvali) +
      global filtr (mix) + kesim jadvali. Har grafik insight matni bilan.
- [ ] Barcha "namuna savollar"ga javob bor: kategoriya, jins (ariza & bandlik), yosh,
      ijro vaqti, status, SLA, xodim samaradorligi, ko'cha, manba, mavsumiylik, mamnuniyat.
- [ ] Dizayn `rules/02` ga mos (rose accent, status badge xaritasi, KPI+grafik tartibi).
- [ ] `npm run lint` toza, `npm run build` o'tadi.
- [ ] `CLAUDE.md` / `docs/MODULLAR-HISOBOTI.md` progressga belgi qo'yiladi.

---

## 12. Demo oqimi (tekshiriladi)
Login → **MSK → Arizalar**: yangi ariza qatorini ochish → xodim tayinlash → status
`jarayonda` → `bajarildi` (timeline yangilanadi) → **MSK → Analitika**: global filtrda
"ayol, 26–35, santexnik" tanlash → KPI va barcha grafiklar shu kesim bo'yicha qayta hisoblanadi.
