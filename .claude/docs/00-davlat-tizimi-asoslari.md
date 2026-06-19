# 00 — Davlat tizimi asoslari va tavsiyalar

> Bu hujjat "davlat tizimi nima va biz nimani qurmoqdamiz" degan savolga javob beradi.
> Davlat sohasini bilmasangiz — shu yerdan boshlang.

---

## 1. "Davlat xizmatlari platformasi" nima?

Bu — fuqaro davlat bilan **internet orqali**, idoraga bormasdan ish ko'radigan tizim.
Asosiy g'oya: *"hujjat odam orqasidan emas, odam orqasidan ma'lumot yuradi"*.

O'zbekistonda allaqachon ishlayotgan haqiqiy tizimlar (biz shularga taqlid qilamiz):

| Soha | Real tizim | Bizning modul |
|---|---|---|
| Yagona portal | **my.gov.uz** (Yagona interaktiv davlat xizmatlari portali) | — (umumiy konsept) |
| Ko'chmas mulk | **kadastr.uz**, **davreestr.uz** (Kadastr agentligi) | Yer/Mol-mulk |
| Gaz | **hududgaz.uz** ("Hududgazta'minot" AJ), HG mobil ilova | Gaz |
| Elektr | **het.uz** ("Hududiy elektr tarmoqlari" AJ), HET Billing | Svet |
| Murojaatlar | **pm.gov.uz** (Prezident virtual qabulxonasi), **murojaat.gov.uz** | Murojaat/Ariza |
| Identifikatsiya | **One ID** (id.egov.uz) — yagona kirish (SSO) | mock qilamiz |

## 2. Bilishingiz shart bo'lgan tushunchalar

- **JSHSHIR (PINFL)** — fuqaroning 14 xonali yagona raqami. Bizda har bir fuqaro
  shu raqam bilan aniqlanadi. (Demo uchun: `30101901230011` kabi 14 raqam generatsiya qiling.)
- **One ID** — davlat tizimlariga yagona login (Google bilan kirish kabi). Real tizimda
  fuqaro One ID orqali kiradi. **Demo uchun**: oddiy login + "One ID orqali kirish"
  tugmasi (mock), bosilganda tayyor demo-foydalanuvchi bilan kiradi.
- **Kadastr raqami** — har bir ko'chmas mulkning (uy, yer) yagona kodi.
  Format: `10:01:01:01:0001` kabi.
- **Abonent / shaxsiy hisob raqami** — gaz va elektr uchun mijoz hisobi.
- **Murojaat** — fuqaroning davlatga yozma yoki elektron arizasi. 3 turi bor:
  **ariza** (so'rov), **shikoyat** (norozilik), **taklif** (g'oya).
- **Ma'muriy reglament** — xizmat qancha kunda, qanday hujjat bilan ko'rsatilishi
  yozilgan rasmiy hujjat. Bizda har bir xizmatning "muddati" shundan keladi.

## 3. Demo strategiyasi — eng muhim tavsiyalar

### Tavsiya 1: Real API ga ulanmang, lekin chegarani toza qoldiring
Demo uchun kadastr.uz yoki het.uz ga ulanish **shart emas va imkonsiz**. Buning o'rniga
har bir modul service ichida **mock provider funksiya** yarating. Real integratsiya kerak
bo'lganda faqat shu funksiyani almashtirasiz — chaqiruvchi kod o'zgarmaydi:
```js
// server/src/modules/yer/services/kadastr.provider.js
// demo: getByCadastreNumber soxta ma'lumot qaytaradi; kelajakda real API
export const getByCadastreNumber = async (n) => ({ /* mock Property */ });
```

### Tavsiya 2: Realistik seed data — demo'ning "joni"
Bo'sh dashboard demo'ni o'ldiradi. Har bir modulga:
- **kamida 200–500 ta yozuv** (fuqarolar, arizalar, to'lovlar, hisoblagichlar)
- **12 oylik tarix** (grafiklar to'la ko'rinishi uchun)
- **turli holatlar** (yangi / ko'rib chiqilmoqda / bajarilgan / rad etilgan)
- realistik o'zbek ismlari, viloyatlar, tumanlar (Andijon, Toshkent, Samarqand...)

### Tavsiya 3: "Savolga raqam + diagramma bilan javob" — bu farqlovchi xususiyat
Loyiha egalari demo'da: *"Andijon viloyatida shu oyda nechta ariza keldi?"* deb
so'raydi. Admin panelda har bir bunday savol **bitta klik bilan** raqam + grafik
beradigan bo'lsin. Buni har modul TZ sidagi "Analitika" bo'limi belgilaydi.

### Tavsiya 4: Birinma-ketin, lekin bitta "tikuv" bilan
Modullarni ketma-ket quring (siz shunday rejalashtirgansiz — to'g'ri). Lekin **birinchi
modulni qurganda** umumiy narsalarni ham yarating: dizayn tizimi, layout, auth (loyihada
allaqachon scaffold qilingan), analitika komponentlari, seed generatori. Keyingi 3 modul shularni qayta ishlatadi —
2-3 barobar tez bo'ladi. Tartib tavsiyasi:

1. **Murojaat/Ariza** — eng "klassik" CRUD + workflow, umumiy patternlar shu yerda tug'iladi.
2. **Gaz** → 3. **Svet** — ikkalasi deyarli bir xil (abonent, hisoblagich, to'lov, sarf grafigi). Gazni qurib, Svetga 70% ni ko'chiring.
3. **Yer/Mol-mulk** — eng murakkab (kadastr, hujjat oqimi), oxiriga.

> **Shukurillo modullari** (alohida tartib, `docs/09-shukurillo-modullari.md`):
> 1. **Soliq** (eng analitik/pulli — KPI va grafik patternlari shu yerda) →
> 2. **Obodonlashtirish** (loyiha + byudjet + ovoz berish) →
> 3. **Yoshlar** (registr + monitoring + yashil/sariq/qizil toifa).

### Tavsiya 5: Rollar — uchtadan ortig'i demo uchun shart emas
`Fuqaro`, `Operator`, `Admin` — yetarli. Murakkablashtirmang.

## 4. Har bir modulda nima bo'lishi kerak (umumiy shablon)

Har TZ shu strukturani to'ldiradi:

1. **Maqsad** — bu modul qanday hayotiy muammoni hal qiladi
2. **Asosiy tushunchalar** — domen lug'ati
3. **Client (fuqaro) funksiyalari** — sodda, belgilangan oqimlar
4. **Admin funksiyalari** — to'liq boshqaruv
5. **Ma'lumotlar modeli** — entity lar va maydonlar
6. **Analitika va hisobotlar** — KPI kartalar + diagrammalar (aniq ro'yxat)
7. **Demo seed data** — nima generatsiya qilish kerak
8. **Real integratsiya nuqtalari** — kelajak uchun eslatma

## 5. Nималардан EHTIYOT bo'lish kerak (demo doirasida QILMANG)

- Real to'lov shlyuzlari (Click/Payme/UzCard) — **mock** "To'landi" tugmasi yetarli.
- Haqiqiy fuqaro ma'lumotlari — faqat **soxta/generatsiya** qilingan.
- Murakkab huquqiy hujjat generatsiyasi (PDF gerb bilan) — demo uchun oddiy PDF/preview.
- Ortiqcha mikroservis arxitektura — bitta Express monolit + `modules/` yetarli (Postgres/Prisma/Docker kerak emas; baza — MongoDB/Mongoose).
