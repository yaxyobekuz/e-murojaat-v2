# `.claude/` — Agent boshqaruv markazi

Bu papka Claude Code (agent) uchun loyihaning butun "miya"si. Agent shu yerdan kontekst,
qoida, skill va buyruqlarni oladi.

> **Stack (haqiqiy):** Backend — **Express + MongoDB (Mongoose)** (NestJS/Prisma/Postgres EMAS).
> Frontend — **Vite + React 19 + Redux Toolkit + TanStack Query + shadcn/Tailwind**, ikkita
> alohida ilova: `client/` (fuqaro) va `admin/`. Kod **plain JavaScript** (`.js`/`.jsx`).
> Eng aniq qoidalar: ildiz `CLAUDE.md`, `server/CLAUDE.md`, `client/CLAUDE.md`, `admin/CLAUDE.md`.

## Tuzilishi

```
.claude/
├── docs/                         # Bilim bazasi (agent o'qiydi)
│   ├── 00-davlat-tizimi-asoslari.md   ← bu yerdan boshlang (kontekst + tavsiyalar)
│   ├── 01-tz-yer-mol-mulk.md          ← TZ: Yer/Mol-mulk
│   ├── 02-tz-gaz.md                   ← TZ: Gaz
│   ├── 03-tz-svet.md                  ← TZ: Svet (Elektr)
│   ├── 04-tz-murojaat.md              ← TZ: Murojaat/Ariza (Yaxyobek BIRINCHI quradi)
│   ├── 05-arxitektura-va-analitika.md ← umumiy patternlar (haqiqiy stackka mos)
│   ├── 06-tz-soliq.md                 ← TZ: Soliq (Shukurillo — BIRINCHI quradi)
│   ├── 07-tz-obodonlashtirish.md      ← TZ: Obodonlashtirish (tashabbusli byudjet)
│   ├── 08-tz-yoshlar.md               ← TZ: Yoshlar ishlari (Yoshlar balansi)
│   └── 09-shukurillo-modullari.md     ← Shukurilloga boshlash qo'llanmasi (shu yerdan boshlang)
├── rules/                        # Qat'iy qoidalar (har doim amal qilinadi)
│   ├── 01-kod-standartlari.md
│   ├── 02-dizayn-tizimi.md
│   └── 03-modul-qurish.md
├── skills/                       # Murakkab vazifalar uchun ko'rsatmalar
│   ├── modul-yaratish/SKILL.md
│   ├── analitika-dashboard/SKILL.md
│   └── ... (scaffold skillari: create-backend-module, create-frontend-feature,
│            add-modal, add-middleware, tanstack-query-for-api, add-role-and-permission,
│            use-shared-components, manage-state-with-useobjectstate, uz-translation-rules)
├── agents/                       # Maxsus subagentlar (tizim-bildirishnoma-qoshish)
└── commands/                     # Tezkor buyruqlar (slash commands)
    ├── yangi-modul.md            → /yangi-modul gaz
    ├── dashboard.md              → /dashboard svet
    ├── seed.md                   → /seed murojaat
    ├── tekshir.md                → /tekshir yer
    └── push.md                   → /push  (client/server/admin uch repoga alohida push)
```

## Qanday ishlatiladi

- **Loyiha konteksti** (`CLAUDE.md`) repo ildizida — agent avtomatik o'qiydi.
- **Yangi modul boshlash:** `/yangi-modul murojaat`
- **Dashboard qurish:** `/dashboard gaz`
- **Tekshirish:** `/tekshir svet`
- **Push:** `/push` (uch repo: client, server, admin)

## Jamoa taqsimoti (kim qaysi modul)
Bu platforma — bitta katta tizim, fullstack jamoa bo'lib quradi. Har kim o'z modullarini
quradi, lekin **umumiy `shared/`, dizayn tizimi va analitika patterni bitta**:

| Dasturchi | Modullari | TZ fayllari |
|---|---|---|
| **Abdukarimov** | Ta'lim, IIB, FVV | (alohida) |
| **Shukurillo** | Soliq, Obodonlashtirish, Yoshlar | `docs/06`, `07`, `08` |
| **Yaxyobek** | Yer/Mol-mulk, Gaz, Svet, Murojaat | `docs/01`, `02`, `03`, `04` |

## Tavsiya etilgan qurish tartibi

**Yaxyobek (umumiy skelet shu jamoada tug'iladi):**
1. `murojaat` (workflow/timeline/analitika skeleti)
2. `gaz` → `svet` (svet — gazning nusxasi)
3. `yer` (eng murakkab, oxirida)

**Shukurillo:**
1. `soliq` (eng analitik/pulli — KPI va grafik patternlari shu yerda)
2. `obodonlashtirish` (loyiha + byudjet + ovoz berish)
3. `yoshlar` (registr + monitoring + yashil/sariq/qizil)

> Sabablari va batafsil yo'riqnoma: `docs/00-davlat-tizimi-asoslari.md` ("Demo strategiyasi")
> va `docs/09-shukurillo-modullari.md` (Shukurilloga maxsus).

## Eslatma
Stack yoki konvensiya o'zgarsa — `CLAUDE.md` (va panel CLAUDE.md lari) hamda tegishli
`rules/` ni yangilang. Agent har doim eng so'nggi versiyani o'qiydi.
