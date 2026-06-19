# 03 — TZ: Svet (Elektr) moduli

> Real prototip: **het.uz** ("Hududiy elektr tarmoqlari" AJ), **HET Billing** (mobil + bot @HETK_bot).
> Strukturasi **Gaz moduli bilan bir xil** — `02-tz-gaz.md` ni asos qiling, quyidagi farqlarni qo'llang.

---

## 1. Maqsad
Elektr iste'molchisi shaxsiy hisobini boshqaradi: kunlik/oylik kVt·soat sarfini kuzatadi,
balansni to'ldiradi, xizmatga ariza beradi. Admin abonent, hisoblagich, to'lov, qarzdorlik
va analitikani boshqaradi.

## 2. Gazdan FARQLARI (faqat shularni o'zgartiring)
| Element | Gaz | Svet |
|---|---|---|
| O'lchov birligi | m³ | **kVt·soat** |
| Hisoblagich | EGHU | **aqlli elektr hisoblagich** |
| Mavsumiylik | qishda yuqori | **yozda yuqori** (konditsioner) |
| Qo'shimcha tushuncha | — | **Ijtimoiy norma** (arzon tarif uchun belgilangan limit) |
| Qo'shimcha analitika | — | norma ichida vs normadan tashqari sarf |
| Qo'shimcha admin | — | **E-dalolatnoma** (qoidabuzarlik/o'g'irlik akti) |

## 3. Client funksiyalari — SODDA
Gaz bilan bir xil, plus:
- **Ijtimoiy norma indikatori** — "bu oyda normangizning 70% ini ishlatdingiz" (progress bar).
- **Tarif kalkulyatori** — sarfni kiritib, to'lovni hisoblab ko'rsatadi.

## 4. Admin funksiyalari — TO'LIQ
Gaz bilan bir xil, plus:
- **E-dalolatnoma** — qoidabuzarliklar ro'yxati (abonent, sana, tur, summa).
- **Ijtimoiy norma hisoboti** — kim normadan oshib ketgan.

## 5. Ma'lumotlar modeli (Gazdan farqli maydonlar)
```
ElectricSubscriber { ...GasSubscriber kabi..., socialNorm_kwh }
ElectricUsage      { id, subscriberId, date, usage_kwh, amount_uzs, withinNorm(bool) }
ElectricViolation  { id, subscriberId, type, date, fine_uzs, status }   // e-dalolatnoma
// qolgani (Meter, Payment, Request, Tariff) Gaz bilan bir xil
```

## 6. Analitika va hisobotlar (DASHBOARD)
**KPI kartalar:**
- Jami abonentlar
- Bu oylik sarf (kVt·soat)
- Bu oylik tushum (so'm)
- Umumiy qarzdorlik (so'm)

**Diagrammalar:**
- **Oylik elektr sarfi (12 oy)** — *area chart* (yozda cho'qqi)
- **Norma ichida vs normadan tashqari sarf** — *stacked bar* (Svetga xos!)
- **Tushum vs qarzdorlik** — *combo*
- **Viloyatlar kesimi** — *bar*
- **Qoidabuzarliklar (e-dalolatnoma) dinamikasi** — *bar*
- **To'lov usullari** — *pie*

**"Savolga javob" misollari:**
- *"Yozda elektr sarfi qancha oshadi?"* → area chart cho'qqisi
- *"Nechta abonent normadan oshib ketgan?"* → KPI + stacked bar

## 7. Demo seed data
Gaz bilan bir xil hajm, lekin:
- Sarf **yozda yuqori** (iyun–avgust cho'qqi).
- Har abonentda `socialNorm_kwh` (masalan 200 kVt·soat), sarfning bir qismi normadan tashqari.
- ~80 ta e-dalolatnoma yozuvi.

## 8. Real integratsiya nuqtalari
- `ElectricBillingProvider` — real HET Billing API.
- Aqlli hisoblagichdan telemetriya.
- One ID + to'lov shlyuzi.

> **Tezlik maslahati:** Gaz modulini `server/src/modules/gaz/` da qurib bo'lgach,
> uni `svet/` ga nusxalab, yuqoridagi farqlarni qo'llang. UI komponentlarning
> ko'pi (sarf grafigi, to'lov formasi, abonent jadvali) **bir xil** — `shared/` ga chiqaring.
