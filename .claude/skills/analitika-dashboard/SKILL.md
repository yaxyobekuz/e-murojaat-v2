---
name: analitika-dashboard
description: >
  Modul uchun analitika/hisobot dashboardini qurish uchun ishlat. KPI kartalar,
  diagrammalar (Recharts) va filtr panelini izchil patternда yaratadi. "dashboard qur",
  "analitika sahifasi", "hisobotlar", "grafik qo'sh" kabi vazifalarda foydalan.
  Loyiha egalari "savolga raqam+diagramma bilan javob" talab qilgani uchun bu kritik.
---

# Skill: Analitika dashboard

Demo'ning farqlovchi xususiyati — har savolga **aniq raqam + diagramma**. Shu skill
har modul dashboardini bir xil, kuchli va toza qiladi.

## Tartib
1. Tegishli TZ ning "Analitika va hisobotlar" bo'limini o'qi — KPI va grafiklar ro'yxati shunda.
2. Grafiklar `recharts` (o'rnatilgan) asosida. Qayta ishlatiluvchi grafik komponentlarini
   `shared/components/ui/` da yarat (mavjud bo'lsa ishlat). Sahifa/feature hech qachon
   `shadcn/*` ga to'g'ridan-to'g'ri murojaat qilmaydi — faqat `shared/components/ui`.
3. Backend `analytics/*` endpointlaridan ma'lumot ol (TanStack Query + `qk` registridagi kalit bilan).

## Dashboard tuzilishi (har doim shu tartib)
```
[ Filtr paneli: Viloyat ▾ | Sana oralig'i 📅 | Tur/Soha ▾ ]   ← tepada, doim ko'rinadi
[ KPI | KPI | KPI | KPI ]                                     ← 3–5 ta karta
[ TrendChart (12 oy)        | DonutChart (tur/holat)  ]       ← 2 ustun grid
[ BreakdownBar (viloyat)    | ComboChart (tushum/qarz) ]
[ DataTable (filtrlanadi)                              ]      ← pastda
```

## Qoidalar
- **Filtr bitta manbada** (URL query). O'zgarsa — barcha KPI va grafiklar yangilanadi.
- Har grafik tepasida **sarlavha**, ostida **1 qatorli insight** matni:
  - Masalan: *"Eng ko'p murojaat — Svet sohasi: 1 240 ta (32%)"*.
  - Bu "savolga javob" hissi beradi — demo'da kuchli ta'sir qiladi.
- KPI kartada: katta raqam + o'tgan davrga nisbatan ▲/▼ % (rang bilan).
- Pul → `1 250 000 so'm`, foiz → `59%`, birlik → `m³` / `kVt·soat`.
- Bo'sh ma'lumot → empty state, "soxta" qiyshiq grafik chizma.
- Yuklanish → skeleton.

## Recharts komponent xaritasi (qaysi savolga qaysi grafik)
| Savol turi | Komponent | Recharts |
|---|---|---|
| "Vaqt bo'yicha qanday o'zgardi?" | `TrendChart` | Area/Line |
| "Nima ko'p, nima kam?" (kesim) | `BreakdownBar` | Bar (gorizontal) |
| "Ulush qancha?" (%) | `DonutChart` | Pie |
| "Ikki ko'rsatkich solishtir" | `ComboChart` | Bar + Line |
| "Holat bo'yicha taqsimot" | stacked `BreakdownBar` | Stacked Bar |

> Jadval uchun loyihada TanStack Table o'rnatilmagan — `shared/components/ui/list`
> komponentidan yoki oddiy jadvaldan foydalan.

## Dizayn
- Ranglar `rules/02-dizayn-tizimi` palitrasidan. Qichqirган emas, yumshoq.
- Grid yengil, tooltip formatlangan, animatsiya minimal.
- Mobil: grafiklar ustma-ust (1 ustun), filtr — drawer.

## Demo savollariga tayyorlik (har dashboardda ishlasin)
- "X viloyatда nechta ...?" → filtr + KPI + bar.
- "Eng ko'p/kam ...?" → BreakdownBar yetakchisi + insight matni.
- "Vaqt bo'yicha trend?" → TrendChart.
- "Qanoatlantirish/qarzdorlik/sarf qancha?" → KPI + tegishli grafik.
