# 02 — TZ: Gaz moduli

> Real prototip: **hududgaz.uz** ("Hududgazta'minot" AJ), HG mobil ilova, HET Billing patterni.
> Gaz va Svet **deyarli bir xil** — Gazni to'liq qurib, Svetga 70% ni ko'chiring.

---

## 1. Maqsad
Gaz iste'molchisi o'z **shaxsiy hisobi**ni boshqaradi: sarfni kuzatadi, balansni
to'ldiradi (to'lov), xizmatga ariza beradi. Davlat (admin) abonentlar, hisoblagichlar,
to'lovlar va qarzdorlikni boshqaradi va analitika ko'radi.

## 2. Asosiy tushunchalar
- **Abonent** — gaz iste'molchisi (fuqaro yoki yuridik shaxs).
- **Shaxsiy hisob raqami** — abonent hisobi (`1234567890`).
- **EGHU (aqlli hisoblagich)** — elektron gaz hisoblagichi, sarfni masofadan beradi.
- **Sarf (m³)** — iste'mol qilingan gaz hajmi.
- **Tarif** — 1 m³ narxi (so'm). Demo uchun tabaqali bo'lishi mumkin.
- **Balans / qarzdorlik** — hisobdagi pul yoki qarz.

## 3. Client (fuqaro) funksiyalari — SODDA
1. **Mening hisobim** — shaxsiy hisob raqami, abonent ismi, manzil, joriy balans/qarzdorlik.
2. **Sarf monitoringi** — kunlik va oylik gaz sarfi grafigi (12 oy).
3. **To'lov qilish** — summani kiritib "To'lash" (mock to'lov → balans yangilanadi).
4. **To'lovlar tarixi** — qachon, qancha to'langan.
5. **Xizmatga ariza** (3–4 tur):
   - Hisoblagich yechish / o'rnatish
   - Gaz tarmoqlariga ulanish (texnik shart olish)
   - Gaz ta'minotini to'xtatish / qayta tiklash
   - Gaz sizishi / ta'mirlash (shoshilinch)
6. **Hisoblagich ma'lumoti** — turi, o'rnatilgan sana, qiyoslash muddati (tugashiga eslatma).

## 4. Admin funksiyalari — TO'LIQ
1. **Abonentlar reyestri** — barcha abonentlar (filtr: viloyat/holat, qidiruv hisob raqami bo'yicha).
2. **Abonent kartochkasi** — ma'lumot + sarf tarixi + to'lovlar + hisoblagich.
3. **To'lovlar** — barcha to'lovlar, kunlik/oylik yig'indi.
4. **Qarzdorlik** — qarzli abonentlar ro'yxati, umumiy qarz summasi.
5. **Arizalar navbati** — xizmat arizalari (status workflow).
6. **Tariflar** — joriy tarifni ko'rish/o'zgartirish.
7. **Analitika dashboardi** (5-bo'lim).

## 5. Ma'lumotlar modeli
```
GasSubscriber { id, accountNumber, fullName/orgName, type(jismoniy|yuridik), region,
                district, address, balance_uzs, debt_uzs, meterId, status, createdAt }
GasMeter      { id, serialNumber, type(EGHU|oddiy), installedAt, lastCalibration,
                calibrationDue }
GasUsage      { id, subscriberId, date, volume_m3, amount_uzs }  // kunlik
GasPayment    { id, subscriberId, amount_uzs, method, paidAt }
GasRequest    { id, requestNumber, subscriberId, serviceType, status, createdAt, note }
GasTariff     { id, price_per_m3, validFrom }
```

## 6. Analitika va hisobotlar (DASHBOARD)
**KPI kartalar:**
- Jami abonentlar
- Bu oylik umumiy sarf (m³)
- Bu oylik tushum (so'm)
- Umumiy qarzdorlik (so'm)

**Diagrammalar:**
- **Oylik gaz sarfi (12 oy)** — *area chart* (qishda yuqori — realistik bo'lsin)
- **Oylik tushum vs qarzdorlik** — *combo bar+line*
- **Viloyatlar kesimida abonentlar** — *bar chart*
- **Abonent turi** (jismoniy/yuridik) — *donut*
- **To'lov usullari** (mock: Click/Payme/UzCard/bank) — *pie*
- **Hisoblagich turlari** (EGHU vs oddiy) — *donut*

**"Savolga javob" misollari:**
- *"Shu oyda qancha tushum bo'ldi?"* → KPI + line
- *"Qaysi viloyatda qarzdorlik eng yuqori?"* → bar chart

## 7. Demo seed data
- ~500 abonent (jismoniy + yuridik, turli viloyat).
- Har abonentga **365 kunlik** sarf (qishda yuqori — mavsumiylik ko'rinsin!).
- ~1500 to'lov yozuvi (12 oyga).
- 20–30% abonentlarda qarzdorlik (realistik).
- ~150 xizmat arizasi.
- 1 demo abonent ("One ID") — login qilib hammasini ko'rsatish uchun.

## 8. Real integratsiya nuqtalari
- `GasBillingProvider` — real "Hududgazta'minot" billing API.
- Aqlli hisoblagichdan real-time sarf (IoT/telemetriya).
- To'lov shlyuzi (Click/Payme) — real.

---
> **Svet moduli uchun eslatma:** bu faylni nusxalab `m³ → kVt·soat`, `gaz → elektr`,
> `EGHU → aqlli elektr hisoblagich` deb almashtirsangiz, Svet TZ sining 80% i tayyor.
> Farqlar `03-tz-svet.md` da.
