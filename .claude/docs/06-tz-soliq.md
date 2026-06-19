# 06 — TZ: Soliq moduli

> Real prototip: **my.soliq.uz** (shaxsiy kabinet), **Soliq mobil ilova**, Davlat soliq qo'mitasi.
> Bu — eng **raqamli/analitik** modul (pul, summa, qarz, to'lov). Umumiy grafik patternlar
> shu yerda tug'iladi va keyingi 2 modul (Obodonlashtirish, Yoshlar) shularni qayta ishlatadi.
> **BIRINCHI shu modulni quring.**
>
> Qoida: soliq stavkalari **2024–2025 davri** asosida (barqaror va toza). 2026 islohotlari
> (1% aylanma, qat'iy soliq bekori) — `mock provider` ichida izoh sifatida qoldiriladi.

---

## 1. Maqsad
Soliq to'lovchi (fuqaro yoki yakka tartibdagi tadbirkor) o'z **soliqlarini** ko'radi:
mol-mulk, yer, daromad solig'i; **qarzdorlik va penyani** kuzatadi; **onlayn to'lov** qiladi
(mock); to'lov tarixini ko'radi. Davlat (admin) soliq to'lovchilar reyestrini, hisob-kitobni,
qarzdorlikni va undirishni boshqaradi hamda kuchli analitika ko'radi. Bu modulning farqlovchi
xususiyati — **pul va raqam** ko'p, demo egasi yaxshi ko'radigan grafiklar shu yerda.

## 2. Asosiy tushunchalar
- **Soliq to'lovchi (taxpayer)** — soliq to'laydigan jismoniy yoki yuridik shaxs.
- **STIR** — soliq to'lovchining identifikatsiya raqami (**9 raqam**, masalan `301234567`).
- **JSHSHIR (PINFL)** — fuqaroning yagona 14 xonali raqami (boshqa modullar bilan bog'lash kaliti).
- **Shaxsiy kabinet** — soliq to'lovchining onlayn hisobi (my.soliq.uz analogi).
- **Soliq xabarnomasi (notification)** — yillik mol-mulk/yer solig'i hisob-kitobi (1-may'gacha keladi).
- **Soliq turlari (demo doirasida):**
  - **Mol-mulk solig'i** — uy/kvartira uchun. Stavka: ≤200 m² → **0.34%**, 200–500 m² → 0.45%, >500 m² → 0.6% (kadastr qiymatidan).
  - **Yer solig'i** — yer uchastkasi uchun (zonaviy stavka yoki kadastr qiymatidan).
  - **Daromad solig'i (JShDS)** — ish haqidan, **12% (yagona stavka)**.
  - **Aylanma solig'i** — YaTT/kichik biznes uchun **4%** (100M so'm'gacha imtiyoz).
- **Qarzdorlik (debt)** — to'lanmagan soliq summasi.
- **Penya** — kechikkanlik jarimasi: **kuniga 0.033%** (`penya = qarz × 0.00033 × kechikkan_kun`).
- **BHM (bazaviy hisoblash miqdori)** — ko'p qat'iy summalar asosi (**412 000 so'm**).
- **Imtiyoz (exemption)** — soliqdan ozod/kamaytirish (masalan nafaqaxo'rlar).
- **To'lov muddati** — mol-mulk va yer solig'i **15-oktabr'gacha** to'lanadi.

## 3. Client (fuqaro) funksiyalari — SODDA
1. **Mening soliqlarim** — STIR/JSHSHIR ga biriktirilgan soliqlar ro'yxati (turi, summa, muddat, holat).
2. **Soliq tafsiloti** — bitta soliq kartochkasi: turi, hisob-kitob asosi (kadastr qiymati/daromad),
   stavka, summa, to'langan/qarz, penya (agar kechikkan bo'lsa).
3. **Qarzdorlik va penya** — umumiy qarz + kuniga o'sib borayotgan penya (qizil indikator).
4. **To'lov qilish** — summani tanlab "To'lash" (mock to'lov → qarz kamayadi, to'lov yozuvi qo'shiladi).
5. **To'lovlar tarixi** — qachon, qancha, qaysi soliq uchun to'langan.
6. **Soliq xabarnomasi** — yillik hisob-kitobni ko'rish (PDF preview mock).
7. **Soliq tekshirish** — STIR kiritib qarzdorlikni ko'rish (ochiq xizmat, login'siz ham).

## 4. Admin funksiyalari — TO'LIQ
1. **Soliq to'lovchilar reyestri** — barcha taxpayer'lar (filtr: viloyat/tur/holat, qidiruv STIR yoki ism bo'yicha).
2. **Soliq to'lovchi kartochkasi** — ma'lumot + soliqlari + to'lovlari + qarzdorligi tarixi.
3. **Soliqlar (assessments)** — barcha hisob-kitoblar, turi bo'yicha filtr, kunlik/oylik tushum.
4. **Qarzdorlik (debt) boshqaruvi** — qarzli to'lovchilar ro'yxati, umumiy qarz, penya, undirishga yo'naltirish.
5. **To'lovlar** — barcha to'lovlar, usul bo'yicha (mock: Click/Payme/Uzum/bank), yig'indi.
6. **Tariflar / stavkalar** — joriy stavkalarni ko'rish/o'zgartirish (mol-mulk, yer, daromad...).
7. **Imtiyozlar** — imtiyozli toifalar boshqaruvi (oddiy CRUD).
8. **Analitika dashboardi** (6-bo'lim) — bu modulning eng kuchli tomoni.

## 5. Ma'lumotlar modeli
```
Taxpayer    { id, stir, jshshir, type(jismoniy|yatt|yuridik), fullName/orgName,
              region, district, address, status, createdAt }
TaxAssessment { id, taxpayerId, taxType(mol_mulk|yer|daromad|aylanma), baseValue_uzs,
              rate, amount_uzs, year, dueDate, status(hisoblandi|qisman|tolandi|qarzdor),
              paidAmount_uzs, penya_uzs, createdAt }
TaxPayment  { id, taxpayerId, assessmentId, amount_uzs, method, paidAt }
TaxRate     { id, taxType, label, rate, validFrom }   // stavkalar
TaxBenefit  { id, taxpayerId, type, note, validFrom }  // imtiyoz
```
> `Taxpayer.jshshir` — boshqa modullar bilan bog'lash kaliti (9-bo'limga qarang).

## 6. Analitika va hisobotlar (DASHBOARD — eng muhim)
**KPI kartalar:**
- Jami soliq to'lovchilar
- Bu oylik tushum (so'm)
- Umumiy qarzdorlik (so'm)
- Undirish ulushi (%) — yig'ilgan / hisoblangan
- Penya jami (so'm)

**Diagrammalar:**
- **Oylik tushum dinamikasi (12 oy)** — *area/line chart* (to'lov muddati oldidan cho'qqi — realistik)
- **Soliq turlari ulushi** (mol-mulk/yer/daromad/aylanma) — *donut*
- **Viloyatlar kesimida tushum** — *gorizontal bar* (qaysi viloyat ko'p to'laydi)
- **Tushum vs qarzdorlik** — *combo (bar+line)*
- **Undirish ulushi viloyatlar bo'yicha (%)** — *bar* (qaysi viloyatda eng past)
- **To'lov usullari** (Click/Payme/Uzum/bank) — *pie*
- **Soliq to'lovchi turlari** (jismoniy/YaTT/yuridik) — *donut*

**"Savolga javob" misollari (demo'da ALBATTA so'raladi):**
- *"Bu oyda qancha tushum bo'ldi?"* → KPI + line
- *"Qaysi viloyatda qarzdorlik eng yuqori?"* → bar chart yetakchisi
- *"Qaysi soliq turi eng ko'p tushum beradi?"* → donut yetakchisi (odatda mol-mulk)
- *"Undirish ulushi qancha?"* → KPI % + viloyat bo'yicha bar

## 7. Demo seed data
- ~**500 soliq to'lovchi** (jismoniy + YaTT + yuridik, 14 viloyatga tarqalган).
- Har to'lovchiga **1–3 soliq turi** (mol-mulk hammada, yer/daromad qisman).
- **12 oylik to'lov tarixi** — to'lov muddati (oktabr) oldidan cho'qqi ko'rinsin.
- ~1500 to'lov yozuvi.
- **25–35% to'lovchilarda qarzdorlik** (realistik), penya bilan.
- Realistik summalar: kvartira mol-mulk solig'i ~**370 000–700 000 so'm/yil**, daromad solig'i 12%.
- STIR (9 raqam) va JSHSHIR (14 raqam) realistik generatsiya.
- 1 demo to'lovchi ("One ID") — 2–3 soliqi, biri qarzdor (penya ko'rsatish uchun).

## 8. Real integratsiya nuqtalari
- `SoliqProvider` interfeysi — real Davlat soliq qo'mitasi billing/hisob-kitob API.
- One ID orqali fuqaroni autentifikatsiya.
- To'lov shlyuzi (Click/Payme/Uzum) — real.
- Soliq xabarnomasi PDF (gerbli shablon) generatsiyasi.
- 2026 islohoti (1% aylanma, qat'iy soliq bekori) — stavka jadvalini `TaxRate` orqali almashtirish.

## 9. Modullararo bog'lanish (bonus — demo'ni jonlantiradi)
> Qattiq bog'lanish yo'q — faqat `jshshir`/`stir` orqali link yoki havola.

- **Soliq qarzi → Murojaat:** qarzdor fuqaro "qarz noto'g'ri hisoblangan" deb **Murojaat/shikoyat**
  yuborishi mumkin (Murojaat modulida `category=soliq`). Demo ssenariysi: qarzni ko'rib → shikoyat berish.
- **Soliq ↔ Yer/Mol-mulk:** mol-mulk solig'i `cadastreNumber` orqali Yer moduliga ishora qiladi
  (soliq qaysi mulkdan kelganini ko'rsatish). Bog'lanish faqat raqam orqali, import yo'q.
- **Soliq ↔ Yoshlar:** yosh tadbirkor (YaTT) soliq imtiyozi — Yoshlar moduli `entrepreneur` statusiga
  ishora qilishi mumkin (kelajak bonus).

---
> **Nega birinchi shu modul:** KPI kartalar, tushum/qarzdorlik grafiklari, filtrlanuvchi reyestr,
> to'lov oqimi va analitika API patterni shu yerda quriladi. Keyingi 2 modul (Obodonlashtirish,
> Yoshlar) shu "skelet"ni qayta ishlatadi. Umumiy grafik komponentlar `shared/components/ui/` ga chiqariladi.
