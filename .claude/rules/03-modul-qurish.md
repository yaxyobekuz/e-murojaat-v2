# Qoida 03 — Modul qurish qoidalari

> Har bir modul **vertikal bo'lak**: o'z backend + frontend (client + admin) qismi bilan.
> Modullar bir-birini to'g'ridan-to'g'ri import qilmaydi. Faqat `shared/` orqali.

## Modul "tayyor" deb hisoblanishi uchun (Definition of Done)
Har bir modulда **hammasi** bo'lishi shart:

- [ ] **Backend:** Mongoose modellar + `modules/<modul>/` (handlers + service + validators + routes) + analytics endpointlar
- [ ] **Seed:** realistik ma'lumot (TZ da ko'rsatilgan hajm, 12 oy tarix)
- [ ] **Client panel:** TZ dagi sodda fuqaro oqimlari (ko'rish, ariza, holat kuzatish)
- [ ] **Admin panel:** to'liq boshqaruv (jadval, filtr, ariza ustida ish, status)
- [ ] **Analitika dashboardi:** KPI kartalar + TZ dagi barcha grafiklar + filtr ishlaydi
- [ ] **Demo oqimi:** "One ID" demo fuqaro bilan login → asosiy oqim oxirigacha ishlaydi
- [ ] **Dizayn:** `rules/02` ga mos, boshqa modullar bilan izchil
- [ ] `CLAUDE.md` progress checklist belgilandi

## Modul yaratish tartibi (agent uchun)
1. Tegishli TZ ni o'qi (`docs/0X-tz-...`).
2. Backend: Mongoose model → service (mock provider bilan) → handlers → routes → analytics.
3. Seed yoz (`server/src/seeds/<modul>.seed.js`) va ishga tushir (ma'lumot bo'lmasa UI ni qurib bo'lmaydi).
4. Admin: jadval + filtr → ariza ustida ish → dashboard.
5. Client: fuqaro sahifalari (soddaroq).
6. Demo oqimini boshdan-oxir tekshir.

## Qayta ishlatish majburiyati (DRY)
- Yangi grafik kerakmi? Avval `shared/components/ui/` da bor-yo'qligini tekshir (recharts asosida).
- Yangi status oqimimi? Mavjud status konstantalari/patternidan foydalan.
- Gaz va Svet **deyarli bir xil** — Gazni qurib, Svetga ko'chir, farqlarni qo'lla (`docs/03`).

## Modullararo bog'lanish (ixtiyoriy, demo'ni jonlantiradi)
- Murojaat moduli boshqa sohaларга ishora qiladi (gaz/svet/yer shikoyati).
  Bunda murojaat `category` orqali tegishli modulга link berishi mumkin (bonus).
- Lekin **qattiq bog'lanish yo'q** — faqat `shared` orqali yoki link.

## Cheklov
- Bitta commit = bitta modul yoki bitta aniq qism. Aralashtirma (`/push` repolarni alohida yuboradi).
- O'z chegarangda qol: backendда `server/src/modules/<modul>/` + tegishli model;
  frontда `<panel>/src/owner/features/<modul>/`. Tashqarisiga faqat `shared/` orqali.
