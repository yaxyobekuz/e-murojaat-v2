# 05 — Umumiy arxitektura va analitika patternlari

> Barcha 4 modul shu umumiy "skelet"dan foydalanadi. Birinchi modulni qurganda shu
> qatlamlarni yarating — keyingilari tez bo'ladi.

---

> Stack: **Express + MongoDB (Mongoose)** backend; **Vite + React 19** frontend, ikkita
> alohida ilova — `client/` (fuqaro) va `admin/`. Kod plain JS (`.js`/`.jsx`).
> To'liq pattern: `server/CLAUDE.md`, `client/CLAUDE.md`, `admin/CLAUDE.md`.

## 1. Umumiy qatlamlar (bir marta quriladi, hamma ishlatadi)

```
server/src/
├── models/             # Mongoose modellar (user, role, permission, + modul entitylari)
├── middleware/         # auth, requireRole, requirePermission, validate, errorHandler...
├── modules/
│   ├── auth/  users/  activityLogs/      # scaffold modullari
│   └── yer/ gaz/ svet/ murojaat/         # har biri: handlers/ services/ validators/ *.routes.js
│       └── handlers/analytics.*.handler.js   # KPI / timeseries / breakdown
├── seeds/              # <modul>.seed.js (faker yo'q — qo'lda generatsiya)
├── jobs/               # Agenda joblar
└── helpers/  utils/    # status, region/district lug'ati, format helpers
```

```
client(va admin)/src/        # FSD; ikkala ilova bir xil struktura
├── shared/
│   ├── components/
│   │   ├── shadcn/      # faqat shared ichida
│   │   ├── ui/          # wrapperlar (Button, Card, Badge... + recharts grafik komponentlar)
│   │   ├── layout/      # AppHeader, AppSidebar (drill-in)
│   │   └── guards/      # AuthGuard, RoleGuard, PermissionGuard
│   ├── api/            # http.js (axios + interceptors)
│   └── lib/query/      # qk (query keys) registri
├── features/auth/      # rol-mustaqil global feature
└── owner/              # panel: features/<modul>/ (api, hooks, components, pages, index.js)
    └── navigation/sidebar.config.js
```

## 2. Umumiy status oqimi (workflow) — barcha modullarda bir xil pattern
Har bir "ariza/murojaat" turidagi obyekt **status** + **timeline (event lar)** bilan ishlaydi:
```
yangi → korib_chiqilmoqda → (yonaltirildi|olchov|tolov) → bajarildi|rad_etildi
```
- `RequestEvent`/`AppealEvent` — Mongoose subdocument yoki alohida collection; har status o'zgarishi yangi yozuv → timeline.
- UI: vertikal timeline komponenti `shared/components/ui/` da.

## 3. Umumiy analitika API patterni
Har modulда bir xil shakl, frontda bir xil grafik komponenti ishlaydi:
```
GET /api/{modul}/analytics/summary        → KPI kartalar { label, value, delta }
GET /api/{modul}/analytics/timeseries?metric=...&months=12  → [{ month, value }]
GET /api/{modul}/analytics/breakdown?by=region|type|status  → [{ key, value }]
```
Filtr parametrlari hammasida bir xil: `?region=&from=&to=&category=`.

## 4. "Savolga raqam + diagramma bilan javob" — markaziy g'oya
Demo'ning farqlovchi xususiyati. Amalga oshirish:
- Admin dashboardda **filtr paneli** (viloyat, sana oralig'i, tur/soha) doim tepada.
- Filtr o'zgarsa — **barcha KPI va grafiklar** yangilanadi (URL query bilan).
- Har grafik ostida bir qatorli "insight" matni (masalan: *"Eng ko'p — Svet sohasi: 1 240 ta"*).

## 5. Qayta ishlatiluvchi grafik komponentlari (`shared/components/ui/`)
`recharts` asosida (o'rnatilgan). Hammasi bir xil props oladi → modullararo izchillik.
Sahifa/feature `shadcn/*` ga to'g'ridan-to'g'ri murojaat qilmaydi — faqat `shared/components/ui`.

| Komponent | Ishlatilishi | Recharts |
|---|---|---|
| `<KpiCard label value delta icon />` | yuqori qator raqamlar | — |
| `<TrendChart data />` | 12 oylik dinamika | `AreaChart`/`LineChart` |
| `<BreakdownBar data />` | viloyat/soha/tur kesimi | `BarChart` |
| `<DonutChart data />` | tur/holat ulushi | `PieChart` |
| `<ComboChart data />` | tushum vs qarzdorlik | `Bar`+`Line` |
| jadval | filtrlanuvchi jadvallar | `shared/components/ui/list` (TanStack Table o'rnatilmagan) |

## 6. Dizayn izchilligi (eng muhim — "yagona tizimdek ko'rinsin")
- Bitta layout: chap `AppSidebar` (drill-in — modul ichiga almashadi), tepa `AppHeader` (qidiruv, profil, til).
- Bitta rang palitra va spacing tizimi (`rules/02-dizayn-tizimi.md`).
- Bitta bo'sh holat (empty state), yuklanish (skeleton), xatolik komponenti.
- Modul ranglari: har modulга bitta **accent rang** (Yer=yashil, Gaz=ko'k, Svet=sariq/amber, Murojaat=binafsha) — lekin asosiy palitra bitta.

## 7. Mock One ID (auth)
- Login sahifada 2 ta tugma: oddiy login + **"One ID orqali kirish"**.
- "One ID" bosilsa → tayyor demo fuqaro bilan kiradi (JSHSHIR, ismi, biriktirilgan obyektlar/abonent/murojaatlar bilan).
- Admin uchun alohida login (`operator` / `admin` roli).

## 8. Demo'ni ko'tarish
- Mahalliy MongoDB (yoki Atlas) kerak — Docker majburiy emas.
- `server`: `cp .env.example .env && npm install && npm run seed:permissions && npm run seed:owner && npm run dev` (port 5000).
- `client` va `admin`: har birida `cp .env.example .env && npm install && npm run dev` (Vite).
- Har modul uchun `npm run seed:<modul>` → realistik ma'lumot.
- README/CLAUDE.md da: demo login (owner `owner`/`owner123`, + fuqaro/operator/admin).
