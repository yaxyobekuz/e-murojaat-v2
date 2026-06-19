# 04 — TZ: Murojaat / Ariza moduli

> Real prototip: **pm.gov.uz** (Prezident virtual qabulxonasi), **murojaat.gov.uz**.
> **BIRINCHI shu modulni quring** — umumiy patternlar (workflow, status, timeline,
> analitika, layout) shu yerda tug'iladi va qolgan 3 modulda qayta ishlatiladi.

---

## 1. Maqsad
Fuqaro davlat organiga **murojaat** (ariza / shikoyat / taklif) yuboradi, holatini
kuzatadi va javob oladi. Davlat (operator/admin) murojaatlarni qabul qiladi, tegishli
bo'limga yo'naltiradi, ko'rib chiqadi va javob beradi. Bu — butun platformaning
"so'rov–javob" yuragi.

## 2. Asosiy tushunchalar
- **Murojaat** — fuqaroning rasmiy yozma so'rovi.
- **Murojaat turi**: `ariza` (so'rov), `shikoyat` (norozilik), `taklif` (g'oya).
- **Murojaat raqami** — unikal kuzatuv kodi (`M-2026-0001234`).
- **Soha / mavzu** — murojaat qaysi sohaga oid (gaz, svet, yer, yo'l, ta'lim...).
- **Tashkilot** — javob beradigan organ (hokimlik, vazirlik, AJ...).
- **Holat (status)**: `Yangi → Ko'rib chiqilmoqda → Yo'naltirildi → Javob berildi → Yopildi`.
- **Natija**: `Qanoatlantirildi` / `Rad etildi` / `Tushuntirildi`.

## 3. Client (fuqaro) funksiyalari — SODDA
1. **Murojaat yuborish** — forma:
   - Tur (ariza/shikoyat/taklif), Soha, Tashkilot (tanlash)
   - Mavzu (sarlavha), Matn, Fayl biriktirish (mock)
   - Yuborilgach: **murojaat raqami** + SMS xabar (mock toast).
2. **Mening murojaatlarim** — yuborilgan murojaatlar ro'yxati + holat.
3. **Murojaat tafsiloti** — to'liq matn + **timeline** (har bosqich sanasi bilan) + javob.
4. **Holat tekshirish** — murojaat raqami orqali holatni ko'rish (login'siz ham).
5. **Onlayn maslahatchi / FAQ** — ko'p beriladigan savollar (oddiy ro'yxat, demo uchun yetarli).

## 4. Admin funksiyalari — TO'LIQ (eng boy admin)
1. **Murojaatlar navbati (Inbox)** — barcha kelgan murojaatlar:
   - Filtr: tur / soha / tashkilot / holat / viloyat / sana oralig'i
   - Qidiruv: raqam yoki matn bo'yicha
   - Saralash: muddati o'tganlar yuqorida (qizil belgi).
2. **Murojaat ustida ish** — ko'rish, holatni o'zgartirish, tashkilotga yo'naltirish,
   javob yozish, izoh (ichki), natija belgilash.
3. **Muddat nazorati** — har murojaatga deadline (masalan 15 kun); muddati yaqinlar/o'tganlar alohida.
4. **Tashkilotlar / sohalar** boshqaruvi (oddiy CRUD).
5. **Analitika dashboardi** (5-bo'lim) — **bu modulda eng kuchli bo'lsin**.

## 5. Ma'lumotlar modeli
```
Appeal       { id, appealNumber, type(ariza|shikoyat|taklif), category, organizationId,
               applicantJshshir, applicantName, region, district, subject, body,
               status, result?, deadline, createdAt, updatedAt, assignedTo? }
AppealEvent  { id, appealId, status, comment, byOperator, createdAt }  // timeline
AppealReply  { id, appealId, body, createdAt }
Organization { id, name, type }
Category     { id, name }   // gaz, svet, yer, yo'l, ta'lim...
```

## 6. Analitika va hisobotlar (DASHBOARD — eng muhim modul!)
**KPI kartalar:**
- Jami murojaatlar
- Bu oydagi yangi murojaatlar
- Ko'rib chiqilmoqda
- **Qanoatlantirish ulushi (%)** — real tizimda ~59% edi, demo'da shunга yaqin
- Muddati o'tgan (qizil)

**Diagrammalar:**
- **Oylik murojaatlar dinamikasi (12 oy)** — *line/area*
- **Murojaat turlari** (ariza/shikoyat/taklif) — *donut*
- **Sohalar bo'yicha** (gaz/svet/yer/yo'l...) — *gorizontal bar* (eng ko'p shikoyat qaysi sohada)
- **Viloyatlar bo'yicha** — *bar* yoki xarita (mock)
- **Natija taqsimoti** (qanoatlantirildi/rad/tushuntirildi) — *stacked bar*
- **O'rtacha javob berish muddati (kun)** — *KPI + trend line*
- **Tashkilotlar reytingi** — kim tez/sekin javob beradi — *bar*

**"Savolga javob" misollari (demo'da ALBATTA so'raladi):**
- *"Eng ko'p shikoyat qaysi sohada?"* → bar chart yetakchisi (masalan: Svet)
- *"Andijon viloyatidan shu oyda nechta murojaat?"* → filtr + KPI + grafik
- *"Qaysi tashkilot eng sekin javob beradi?"* → reyting bar

## 7. Demo seed data
- ~600 murojaat (12 oyga tarqalган), turli tur/soha/viloyat/holat.
- Har murojaatga 2–5 ta AppealEvent (timeline boy ko'rinsin).
- ~60% qanoatlantirilgan, qolgani rad/tushuntirilgan/jarayonda (realistik).
- 8–10 ta tashkilot, 6–8 ta soha.
- Bir nechtasi **muddati o'tgan** (qizil indikator demo'da ko'rinsin).
- 1 demo fuqaro ("One ID") — 4–5 murojaat bilan.

## 8. Real integratsiya nuqtalari
- One ID autentifikatsiya.
- SMS shlyuzi (real xabarnoma).
- Boshqa modullarga ulanish: gaz/svet shikoyati avtomatik tegishli modulга bog'lansin.
- E-imzo (ERI) bilan murojaat tasdiqlash.

---
> **Nega birinchi shu modul:** workflow (status oqimi), timeline komponenti, filtrli
> jadval, analitika dashboardi, layout va auth — hammasi shu yerda quriladi va keyingi
> 3 modul shu "skelet"ni qayta ishlatadi.
