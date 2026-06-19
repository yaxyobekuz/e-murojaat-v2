# Qoida 01 — Kod standartlari

> Agent har doim shu qoidalarga amal qiladi. Maqsad: 3 kishi ishlaganda kod bir xil ko'rinsin.

> Loyiha **plain JavaScript** (`.js` / `.jsx`) — TypeScript, NestJS, Prisma ishlatilmaydi.
> To'liq pattern: `server/CLAUDE.md`, `client/CLAUDE.md`, `admin/CLAUDE.md`.

## Til
- **UI matni** — o'zbekcha (lotin), to'g'ridan-to'g'ri yoziladi (i18n hozircha yo'q).
- **Kod, o'zgaruvchi, funksiya, fayl nomlari** — inglizcha, `camelCase` / `PascalCase`.
- **Domen atamalari** kodda inglizcha-translit: `Appeal`, `GasSubscriber`, `Property`,
  `cadastreNumber`, `accountNumber`, `jshshir`.

## Umumiy kod
- ES modullar (`import`/`export`), `type: "module"`. `any`/TS yo'q (oddiy JS).
- Validatsiya **zod** bilan: backendда `validate` middleware orqali, frontда forma uchun.
- Izoh: faqat WHY aniq bo'lmaganда, bitta qisqa qator. Multi-line docstring yozma.

## Backend (Express + Mongoose)
- Har endpoint alohida fayl: `modules/<modul>/handlers/<action>.handler.js`,
  `asyncHandler` bilan o'raladi.
- Biznes-logika **service**da (`services/<modul>.service.js`) — DB ga to'g'ridan-to'g'ri kiradi.
- Router (`<modul>.routes.js`) faqat HTTP simlari: `requireAuth` → `requirePermission(...)` → `validate(...)` → handler.
- Tashqi tizim (kadastr/billing) — service ichida **mock funksiya/provider**, real ulanishni keyin almashtirish uchun interfeys saqlanadi.
- Xatolik: `ApiError` (`utils/ApiError.js`) tashlanadi, markaziy `errorHandler` izchil shakl beradi: `{ success:false, message, code }`.
- Javob shakli: `{ success:true, data, message, meta }`.

## Frontend (React, FSD)
- Funksional komponent + hooks. Sahifa/komponent = `PascalCase.jsx`.
- Server holati uchun **TanStack Query** (`api/*.api.js` + `hooks/use*`); sahifa hech qachon to'g'ridan-to'g'ri `axios` chaqirmaydi.
- Query kalitlari faqat `qk` registridan (`shared/lib/query/keys.js`) — yangi kalit o'ylab topilmaydi.
- 1 dan ortiq bog'liq state bo'lsa — `useObjectState` (`manage-state-with-useobjectstate` skill).
- Komponent **150 qatordan oshsa** — bo'ling.
- UI faqat `shared/components/ui/*` dan; `shadcn/*` to'g'ridan-to'g'ri import qilinmaydi.
- Modal faqat `ModalWrapper` orqali, nomi `shared/constants/modals.js` konstantasidan.
- Token: refresh — http-only cookie, hech qachon `localStorage` da emas.

## Umumiy
- Hech qachon sirli ma'lumot (secret/parol) kodga yozilmaydi — `.env`.
- `.env.example` doim yangilanadi.
- Commit: `feat(gaz): ...`, `fix(murojaat): ...` (conventional commits). Uch repo (client/server/admin) alohida — `/push` buyrug'i bor.
- Har modul tugaganda tegishli `CLAUDE.md` dagi progress checklist belgilanadi.

## Demo cheklovlari (QILMA)
- Real to'lov/SMS/SSO integratsiyasi — mock.
- Ortiqcha abstraksiya, mikroservis, GraphQL, TypeScriptga o'tish — kerak emas.
- Test bilan ortiqcha shug'ullanmaslik: kritik service larga 2-3 ta smoke test yetarli (demo).
