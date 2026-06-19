# Template — Client + Server starter

A clean, role-ready monorepo template: **React (Vite) + Express + MongoDB**. Clone, rename, then build your own admin/owner panel on top of it.

## Project structure (monorepo)

```
template/
├─ client/          # Frontend: Vite + React 19 + Redux Toolkit + TanStack Query + shadcn/ui
├─ server/          # Backend: Node.js + Express + MongoDB (Mongoose) + Agenda
├─ CLAUDE.md        # General rules (this file)
└─ .claude/
   └─ skills/       # Local skills for Claude (Code)
```

- Frontend and backend rules are separate: `client/CLAUDE.md`, `server/CLAUDE.md`.
- Skills: `.claude/skills/<skill-id>/SKILL.md`.

## Core rules (strict)

1. **Language:** all user-facing text — **in Uzbek**. Code values (id, role value, query key, route, file name) — **in English**.
2. **Comments:** comments in code — a single very short line, only when WHY is not obvious. Never write multi-line docstrings.
3. **shadcn**: `client/src/shared/components/shadcn/*` is wrapped only inside `shared/`; pages/features do not use it directly.
4. **Modal**: only via `ModalWrapper`; the modal name comes from a constant in `shared/constants/modals.js`.
5. **API**: via TanStack Query. A page never calls `axios` directly — every feature works through `api/*.api.js` + `hooks/use*`.
6. **Role system**: 1 static role (`owner`) + dynamic roles in the DB + dynamic permissions.
7. **Owner — super-admin**: automatically has all permissions.
8. **Auth**: JWT access (15min, body) + refresh (7 days, httpOnly secure cookie). Refresh token is never stored in localStorage.

## Role/permission concept

- `owner` is the only hard-coded static role (`ROLES.OWNER = "owner"`).
- Other roles live in the `Role` collection — they can be added/removed by an admin at runtime.
- `permission` — DB record, `{ key: "users.read", label: "Foydalanuvchilarni ko'rish" }`.
- Permissions are attached to a role (`Role.permissions: ObjectId[]`).
- Backend protection: `requireAuth` -> `requireRole(...)` or `requirePermission("users.read")`.
- Frontend protection: `<RoleGuard roles="owner">` and `<PermissionGuard required="users.read">`.

## What's included (template scaffold)

- **Auth**: login (username/phone + password), refresh-token rotation, logout, `/auth/me`.
- **Users**: list, get-by-id, update, soft-delete (owner-only edits).
- **Roles + Permissions**: 1 static `owner` role + DB-driven roles/permissions, seedable via `npm run seed:permissions`.
- **Activity logs**: every POST/PATCH/PUT/DELETE is auto-logged with sanitized body.
- **Owner panel** (`client/src/owner/`): layout + sidebar + an empty `DashboardPage`. Add features under `owner/features/`.
- **Adding more panels**: copy `client/src/owner/` to `client/src/<new-role>/`, change the route paths, then register the new role's sidebar in `shared/components/layout/AppSidebar.jsx`.

## Skills (`.claude/skills/`)

| ID | When to use |
|---|---|
| `create-frontend-feature` | When adding a new feature to a role panel (owner or a cloned one) |
| `create-backend-module` | When adding a new module under `server/src/modules/<name>/` |
| `add-modal` | When creating a new modal with ModalWrapper |
| `tanstack-query-for-api` | When writing a new query/mutation hook |
| `add-role-and-permission` | When adding a new permission, a new dynamic role, or linking them |
| `add-middleware` | When writing a new middleware on the backend |
| `manage-state-with-useobjectstate` | When a FE component has more than 1 state |
| `uz-translation-rules` | When UI text vs code value separation is needed |
| `use-shared-components` | When building any client page/feature — pages must import from `shared/components/ui/*`, never from `shadcn/*` |

Each skill is described in detail in its `.claude/skills/<id>/SKILL.md` file.

## Modullar holati (progress)

| Modul | Backend | Seed | Admin | Client | Dashboard | Holat |
|---|---|---|---|---|---|---|
| **Soliq** | ✅ | ✅ | ✅ | ✅ | ✅ | **Tayyor** |
| **Yer / Mol-mulk** | ✅ | ✅ | ✅ | ✅ | ✅ | **Tayyor** |
| **Gaz** | ✅ | ✅ | ✅ | ✅ | ✅ | **Tayyor** |
| **Svet (Elektr)** | ✅ | ✅ | ✅ | ✅ | ✅ | **Tayyor** |
| **Murojaat** | ✅ | ✅ | ✅ | ✅ | ✅ | **Tayyor** |

### Yer moduli — Definition of Done
- [x] **Backend:** `models/` (Property, PropertyOwner, PropertyRequest) + `modules/yer/` (handlers + service + kadastr mock provider + validators + routes) + analytics endpointlar (`summary`/`timeseries`/`breakdown`)
- [x] **Seed:** `seed:yer` — 400 obyekt, 250 ariza (12 oy tarix, timeline eventlar), demo "One ID" fuqaro (owner user JSHSHIR bilan bog'landi)
- [x] **Client panel:** Mening mulklarim, Mulk tafsiloti, Reyestrdan ko'chirma, Yangi ariza, Arizalarim (timeline)
- [x] **Admin panel:** Reyestr (jadval+filtr), Arizalar navbati, Ariza ustida ish (status modal + timeline)
- [x] **Analitika dashboardi:** KPI kartalar + 5 grafik (trend/donut/bar) + filtr paneli
- [x] **Demo oqimi:** fuqaro ariza → admin status (yangi→tolov→bajarildi) → timeline; terminal guard (409); reyestr lookup — API orqali tekshirildi
- [x] **Dizayn:** `rules/02` (emerald accent, status badge xaritasi, KPI+grafik tartibi)

### Gaz moduli — Definition of Done
- [x] **Backend:** `models/` (GasSubscriber — meterId ref, GasMeter, GasUsage — kunlik, GasPayment, GasRequest — events[], GasTariff) + `modules/gaz/` (handlers + service + HG billing mock provider + validators + routes) + analytics endpointlar (`summary`/`timeseries` (usage+revenue+charged)/`breakdown?by=region|type|status|serviceType|method|meterType`). Permission: `gaz.read`/`gaz.manage`
- [x] **Seed:** `seed:gaz` — 401 abonent + hisoblagich, 146k kunlik sarf (qishda cho'qqi: yanv ×1.6 vs iyul ×0.3 mavsumiylik), 1504 to'lov, 153 ariza, ~25% qarzdorlik, demo "One ID" abonent (9000000007, qarz 420k)
- [x] **Client panel:** Mening hisobim (balans/qarz + hisoblagich + tarif), Sarf monitoringi (12 oy grafik), To'lov qilish (mock — qarzni yopadi), To'lovlar tarixi, Xizmatga ariza, Arizalarim (timeline), Abonentni tekshirish
- [x] **Admin panel:** Abonentlar reyestri (jadval+filtr), Abonent kartochkasi (sarf grafigi+to'lovlar+hisoblagich), Arizalar navbati, Ariza ustida ish (status modal + timeline), To'lovlar, Qarzdorlik
- [x] **Analitika dashboardi:** 4 KPI (abonent/oylik sarf m³/oylik tushum/umumiy qarz) + 6 grafik (sarf trend / tushum vs hisoblangan combo / viloyat bar / abonent turi donut / to'lov usuli donut / hisoblagich turi donut) + filtr paneli (viloyat/sana)
- [x] **Demo oqimi:** fuqaro ariza → admin status (yangi→ko'rib→yo'naltirildi→bajarildi) → terminal guard (409) → mock to'lov qarzni yopdi (420k→0, status faol) — API orqali tekshirildi
- [x] **Dizayn:** `rules/02` (ko'k accent #1E4FD8, status badge xaritasi, KPI+grafik tartibi)

### Murojaat moduli — Definition of Done
- [x] **Backend:** `models/` (Appeal — events[]+replies[] embedded, Organization) + `modules/murojaat/` (handlers + service + SMS mock provider + validators + routes) + analytics endpointlar (`summary`/`timeseries`/`breakdown` — region/type/category/status/result/organization kesimi). Permission: `murojaat.read`/`murojaat.manage`
- [x] **Seed:** `seed:murojaat` — 600+ murojaat (12 oy tarix, timeline eventlar), 10 tashkilot, ~61% qanoatlantirildi, muddati o'tganlar (qizil), demo "One ID" fuqaro (4 murojaat)
- [x] **Client panel:** Yangi murojaat, Mening murojaatlarim (timeline+javob), Holatni tekshirish (raqam orqali), Savol-javob (FAQ)
- [x] **Admin panel:** Murojaatlar navbati (filtr: tur/soha/holat/viloyat/muddat + qidiruv, overdue=qizil), Murojaat ustida ish (status/yo'naltirish/javob/natija + timeline), Tashkilotlar boshqaruvi
- [x] **Analitika dashboardi:** 6 KPI (jami/yangi/jarayonda/qanoatlantirish %/muddati o'tgan/o'rtacha javob) + 7 grafik (trend/donut/bar + tashkilotlar reytingi) + filtr paneli
- [x] **Demo oqimi:** fuqaro murojaat → admin yo'naltirish → javob (avto "javob_berildi") → yopish (natija majburiy) → terminal guard (409) → raqam orqali kuzatish — service orqali tekshirildi
- [x] **Dizayn:** `rules/02` (violet accent, status badge xaritasi, KPI+grafik tartibi)

### Svet (Elektr) moduli — Definition of Done
- [x] **Backend:** `models/` (ElectricSubscriber — meter embedded, ElectricUsage — within/over-norm split, ElectricPayment, ElectricRequest — events[], ElectricViolation — e-dalolatnoma, ElectricTariff) + `modules/svet/` (handlers + service + HET billing mock provider + validators + routes) + analytics endpointlar (`summary`/`timeseries?metric=usage|norm|revenue`/`breakdown?by=region|type|method|violationType|status`). Permission: `svet.read`/`svet.manage`
- [x] **Seed:** `seed:svet` — 401 abonent, 4812 oylik sarf (yozda cho'qqi: iyun 506k vs aprel 284k kVt·soat), 1410 to'lov, 153 ariza, 80 e-dalolatnoma, ~25% qarzdorlik, demo "One ID" abonent (40000001, qarz 180k)
- [x] **Client panel:** Mening hisobim (balans/qarz + ijtimoiy norma progress indikatori + hisoblagich), Sarf monitoringi (12 oy grafik + tarif kalkulyatori), To'lov qilish (mock + tarix), Yangi ariza, Arizalarim (timeline)
- [x] **Admin panel:** Abonentlar reyestri (jadval+filtr), Abonent kartochkasi (sarf grafigi+to'lovlar+hisoblagich), Arizalar navbati, Ariza ustida ish (status modal + timeline), E-dalolatnoma (qoidabuzarliklar)
- [x] **Analitika dashboardi:** 4 KPI + 7 grafik (sarf trend / norma ichida vs tashqari stacked / tushum combo / viloyat bar / abonent turi donut / to'lov usuli donut / qoidabuzarlik bar) + filtr paneli
- [x] **Demo oqimi:** fuqaro ariza → admin status (yangi→ko'rib→tolov+invoys→bajarildi, 4 event) → terminal guard (409) → mock to'lov qarzni yopdi (180k→0, qoldiq balansga) — API orqali tekshirildi
- [x] **Dizayn:** `rules/02` (amber accent, status badge xaritasi, KPI+grafik tartibi). Yangi shared chartlar: `StackedBar`, `ComboChart`

## Initial workflow

1. `cd server && cp .env.example .env && npm install && npm run seed:permissions && npm run seed:owner && npm run seed:yer && npm run dev` — backend.
2. `cd client && cp .env.example .env && npm install && npm run dev` — frontend on port 5173.
3. Default owner login (from `seed:owner`): `owner` / `owner123`. `seed:yer` links a demo JSHSHIR to this user (acts as the citizen in the client app).
4. Log in on the frontend → automatically redirected to `/owner/dashboard`. Yer moduli: client `/owner/yer/*`, admin `/owner/soliq/yer`.
5. Murojaat moduli: `npm run seed:murojaat` (server). Client `/owner/murojaat/*` (yangi/mening/holat/faq), admin `/owner/murojaat/*` (analitika/inbox/tashkilotlar). Public kuzatuv: `GET /api/murojaat/track?appealNumber=...`.
6. Svet (Elektr) moduli: `npm run seed:svet` (server, `seed:owner` dan keyin). Client `/owner/elektr/*` (hisobim/sarf/tolov/ariza/arizalarim), admin `/owner/soliq/elektr/*` (analitika/abonentlar/arizalar/qoidabuzarliklar). Demo abonent JSHSHIR owner user bilan bog'lanadi.
7. Gaz moduli: `npm run seed:gaz` (server, `seed:owner` dan keyin). Client `/owner/gaz/*` (hisobim/sarf/tolov/tolovlar/ariza/arizalarim/tekshirish), admin `/owner/soliq/gaz/*` (analitika/abonentlar/arizalar/tolovlar/qarzdorlar). Demo abonent (9000000007) JSHSHIR owner user bilan bog'lanadi.
8. Soliq moduli: `npm run seed:soliq` (server). Client `/owner/soliq` ("Mening soliqlarim"), admin `/owner/soliq/*` (analitika/taxpayers/assessments/debtors). Demo to'lovchi STIR `301234567`.

## Modullar progress (Shukurillo)

Har modul tugaganida belgilanadi (Definition of Done: `.claude/rules/03-modul-qurish.md`).

### Soliq — ✅ tayyor
- [x] **Backend**: `Taxpayer`, `TaxAssessment`, `TaxPayment` modellar (4-darajali hudud: region/district/settlement/mahalla) + `modules/soliq/` (handlers + service + provider + validators + routes) + analytics (summary/timeseries/breakdown/mahalla) + `locations` (drilldown ma'lumotnoma)
- [x] **Hudud ierarxiyasi**: `helpers/regions.helper.js` — 14 viloyat → tuman → qishloq/shahar → mahalla (552 MFY), `mahallaOverview` (mahalla "kartochkasi")
- [x] **Seed**: `npm run seed:soliq` — **5001 to'lovchi**, ~10000 hisob-kitob, ~17000 to'lov, ~29% qarzdor (penya bilan), har biri 4-darajali real hududda. Demo "One ID" (STIR `301234567`) — Chamanzor MFY, Qo'rg'ontepa, Asaka, Andijon
- [x] **Admin**: Analitika dashboard (5 KPI + 4 grafik) + **ierarxik hudud filtri** (viloyat→tuman→qishloq→mahalla kaskad). Mahalla tanlanganda → mahalla "kartochkasi" (KPI + to'lov holati donut + yo'nalish/soliq turi bar + **soliq to'lamaganlar ro'yxati**). To'lovchilar/Soliqlar/Qarzdorlik sahifalari ham hudud bo'yicha filtrlanadi
- [x] **Client**: "Mening soliqlarim" (KPI + soliqlar + to'lov + tarix), demo to'lovchi bilan
- [x] **Demo oqimi**: login → hudud drilldown → mahalla kartochka → qarzdorlar → to'lovchi → to'lov ✅ E2E tekshirildi
- [x] **Terminologiya**: "tushum" → "yig'ilgan soliq" (UI da "Soliq")
- [x] **Dizayn**: `rules/02` ga mos (indigo accent, status badge rang xaritasi, skeleton, recharts grafiklar)
- [x] **Qayta ishlatiladigan**: `shared/components/ui/chart/*` (TrendChart, BreakdownBar, DonutChart, ChartCard), `table/*` (DataTable, EmptyState), `badge/StatusBadge`, `data/regions.js` (mahallaLabel) — keyingi modullar shularni ishlatadi

### Obodonlashtirish — ⬜ navbatda
### Yoshlar — ⬜ navbatda
