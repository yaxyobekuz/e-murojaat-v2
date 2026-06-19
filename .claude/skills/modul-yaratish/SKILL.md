---
name: modul-yaratish
description: >
  Yangi davlat xizmati modulini (Yer, Gaz, Svet, Murojaat) boshdan-oxir qurish uchun
  ishlat. Backend (Express + Mongoose), seed, admin panel, client panel va analitika
  dashboardini izchil tartibda yaratadi. "yangi modul qur", "gaz modulini boshla",
  "svet modulini yarat" kabi vazifalarda foydalan.
---

# Skill: Modul yaratish (boshdan-oxir)

Bu skill bitta modulni to'liq, ishlaydigan holatda quradi. Har doim shu tartibni kuzat.

> Stack: **Express + MongoDB (Mongoose)** backend, **Vite + React 19** (client va admin
> alohida ilovalar). Kod **plain JavaScript** (`.js` / `.jsx`) — TypeScript/Prisma/NestJS
> ishlatilmaydi. Loyiha qoidalari: ildiz `CLAUDE.md`, `server/CLAUDE.md`, `client/CLAUDE.md`,
> `admin/CLAUDE.md`.

## 0-qadam: Kontekstni yukla
Quyidagilarni o'qi:
- `.claude/docs/00-davlat-tizimi-asoslari.md`
- Tegishli TZ: `.claude/docs/0X-tz-<modul>.md`
- `.claude/docs/05-arxitektura-va-analitika.md`
- `.claude/rules/` (hammasi)
- `server/CLAUDE.md` va tegishli panelning `CLAUDE.md` (client/admin)

## 1-qadam: Backend (Express + Mongoose)
1. Mongoose modellari: `server/src/models/<entity>.model.js` (TZ dagi entity lar).
2. `server/src/modules/<modul>/` yarat (`server/CLAUDE.md` patterni):
   - `handlers/<action>.handler.js` — har endpoint alohida fayl (`list`, `getById`, `create`, `update`, `remove`).
   - `services/<modul>.service.js` — biznes-logika, DB ga to'g'ridan-to'g'ri kiradi.
   - `validators/` — zod sxemalar (`validate` middleware bilan).
   - `<modul>.routes.js` — router yig'iladi; `server/src/routes/index.js` ga `/api` ostiga ulanadi.
   - Tashqi tizim (kadastr/billing) kerak bo'lsa `services/` ichida **mock provider funksiya** sifatida — keyin real implementatsiyaga almashtirish uchun interfeysni saqla.
3. Analitika endpointlari (`05-arxitektura` patterni), alohida handler fayllarda:
   - `GET /analytics/summary` (KPI), `/analytics/timeseries`, `/analytics/breakdown`.
   - Hammasi filtr qabul qiladi: `region`, `from`, `to`, `category/type`.
4. Himoya: `requireAuth -> requirePermission("<modul>.read")`; yangi permissionlar uchun `add-role-and-permission` skill.

## 2-qadam: Seed (eng muhim — ma'lumotsiz UI yo'q)
1. `server/src/seeds/<modul>.seed.js` yoz (mavjud `permissions.seed.js` / `owner.seed.js` uslubida).
2. `package.json` ga `seed:<modul>` skriptini qo'sh.
3. TZ dagi hajm va **12 oylik tarix** bilan realistik ma'lumot:
   - O'zbek ismlari, viloyat/tuman, realistik raqamlar (kadastr/abonent/murojaat).
   - **Mavsumiylik** (gaz qishda, svet yozda yuqori).
   - Turli holat/status, ba'zilari muddati o'tgan.
   - 1 ta demo "One ID" foydalanuvchi to'liq ma'lumot bilan.
   - Tasodifiy ma'lumotni o'zing generatsiya qil (faker o'rnatilmagan).
4. Ishga tushir, tekshir: jadval bo'sh emasligi, grafik to'lalligi.

## 3-qadam: Admin panel (`admin/`)
1. `admin/src/owner/features/<modul>/` (FSD — `admin/CLAUDE.md` patterni):
   - `api/<modul>.api.js` — sof axios funksiyalar (`http` orqali).
   - `hooks/use*Query.js` / `use*Mutation.js` — TanStack Query, `qk` registridan kalit.
   - `components/` — `DataTable` (jadval), filtr paneli, modallar (`ModalWrapper`).
   - `pages/` — ro'yxat sahifasi + tafsilot/ish sahifasi (status, izoh, timeline).
   - `pages/<Modul>DashboardPage.jsx` — `analitika-dashboard` skill bilan.
   - `index.js` — feature public API.
2. Modulni `admin/src/owner/navigation/sidebar.config.js` ga qo'sh (drill-in qoidasi — `admin/CLAUDE.md`).
3. `rules/02-dizayn-tizimi` ga qat'iy amal qil. Faqat `shared/components/ui` dan foydalan (`shadcn/*` to'g'ridan-to'g'ri emas).

## 4-qadam: Client panel (`client/`, soddaroq)
1. `client/src/owner/features/<modul>/` (yoki fuqaro roli paneli) — admin bilan bir xil FSD struktura.
   - Fuqaro ko'radigan ma'lumot (o'z mulki/hisobi/murojaatlari).
   - Ariza/murojaat yuborish formasi (`useObjectState` bilan).
   - Holat kuzatish (timeline).
2. Sodda, belgilangan oqimlar — admin kabi boy emas.

## 5-qadam: Demo oqimini tekshir
- "One ID" demo fuqaro bilan login.
- Asosiy oqim boshdan-oxir: ko'rish → ariza → admin ko'rib chiqish → holat yangilanishi.
- Dashboard filtrlari KPI va grafiklarni yangilaydi.

## 6-qadam: Yakunlash
- Tegishli `CLAUDE.md` progress checklistni belgila.
- Conventional commit: `feat(<modul>): modul to'liq qurildi` (yoki `/push` bilan har repo alohida).

## Tezlik maslahati
Gaz tugagach Svetni noldan qurma — Gazni (`server/src/modules/gaz/` + admin/client feature)
nusxa qilib `svet/` ga ko'chir, `docs/03-tz-svet.md` dagi farqlarni qo'lla
(m³ → kVt·soat, qish → yoz, +ijtimoiy norma, +e-dalolatnoma).
