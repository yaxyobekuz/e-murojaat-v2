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
│   ├── 04-tz-murojaat.md              ← TZ: Murojaat/Ariza (BIRINCHI quring)
│   └── 05-arxitektura-va-analitika.md ← umumiy patternlar (haqiqiy stackka mos)
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

## Tavsiya etilgan qurish tartibi
1. `murojaat` (umumiy skelet shu yerda tug'iladi)
2. `gaz` → `svet` (svet — gazning nusxasi)
3. `yer` (eng murakkab, oxirida)

> Sabablari: `.claude/docs/00-davlat-tizimi-asoslari.md` → "Demo strategiyasi".

## Eslatma
Stack yoki konvensiya o'zgarsa — `CLAUDE.md` (va panel CLAUDE.md lari) hamda tegishli
`rules/` ni yangilang. Agent har doim eng so'nggi versiyani o'qiydi.
