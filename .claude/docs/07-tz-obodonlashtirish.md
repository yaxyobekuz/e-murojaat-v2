# 07 — TZ: Obodonlashtirish moduli

> Real prototip: **openbudget.uz** ("Ochiq budjet" — Tashabbusli/Initsiativ byudjet),
> **"Obod mahalla" / "Obod qishloq"** dasturlari, hokimlik obodonlashtirish loyihalari.
> Bu modul **Soliq'dan keyin** quriladi — KPI/grafik patternlarni Soliq'dan oladi.
>
> G'oya: fuqaro mahalladagi obodonlashtirish **loyihasini taklif qiladi** va unga
> **OVOZ beradi**. Davlat (admin) loyihalarni moderatsiya qiladi, byudjet taqsimlaydi,
> mavsumni boshqaradi va g'oliblarni aniqlaydi. "Loyiha + byudjet + ovoz" — bu modulning yuragi.

---

## 1. Maqsad
Aholi yashash joyini yaxshilash uchun **obodonlashtirish loyihasi** (yo'l, yoritish, bog',
maktab, suv...) taklif qiladi, loyihalarga **ovoz beradi** va eng ko'p ovoz olganlar davlat
byudjetidan moliyalashtiriladi (tashabbusli byudjet). Admin loyihalarni ko'rib chiqadi,
byudjet limitlarini boshqaradi, g'oliblarni aniqlaydi va bajarilishini kuzatadi.

## 2. Asosiy tushunchalar
- **Loyiha (project)** — moliyalashtirish uchun taklif qilingan obodonlashtirish ishi.
- **Tashabbus (initiative)** — fuqaro yuborgan dastlabki taklif (loyihaga aylanadi).
- **Mavsum (season)** — yiliga 2 marta o'tadigan tsikl (taklif → moderatsiya → ovoz → g'olib).
- **Ovoz berish (voting)** — fuqaro bitta loyihaga ovoz beradi. **Min 50 ovoz** — g'olib bo'lish sharti.
- **Byudjet (budget)** — har tuman/shaharga ajratilgan summa (aholi soni + mahalla soniга qarab).
- **Smeta (cost estimate)** — loyiha qiymati. Limit: qurilish ≤ **4000×BHM**, jihoz ≤ 2000×BHM.
- **Kategoriya** — yo'l, maktab, yoritish, suv, bog', sport, ko'kalamzorlashtirish, bolalar maydonchasi...
- **Mahalla** — eng kichik ma'muriy birlik (loyiha shu darajada bo'ladi). Rais — boshlig'i.
- **Hokimlik** — tuman/viloyat hokimi mahkamasi (byudjetni tasdiqlaydi).
- **BHM** — bazaviy hisoblash miqdori (**412 000 so'm**), smeta limitlari shunda hisoblanadi.

## 3. Client (fuqaro) funksiyalari — SODDA
1. **Loyihalar ro'yxati** — joriy mavsumdagi loyihalar (filtr: viloyat/tuman/kategoriya/holat).
2. **Loyiha tafsiloti** — sarlavha, tavsif, kategoriya, smeta, manzil (mahalla), joriy ovozlar soni, holat.
3. **OVOZ berish** — bitta loyihaga "Ovoz berish" (mock SMS tasdiq → ovoz +1). Qoida:
   bir kishi — bitta ovoz, bitta loyihaga (`jshshir` bo'yicha takror ovoz bloklanadi).
4. **Loyiha taklif qilish** — forma: kategoriya, mahalla, sarlavha, tavsif, taxminiy smeta, foto (mock).
   Yuborilgach: **tashabbus raqami** + holat = `ko'rib chiqilmoqda`.
5. **Mening tashabbuslarim / ovozlarim** — yuborgan loyihalarim + ovoz berganlarim, holat bilan.
6. **G'oliblar** — joriy/o'tgan mavsum g'oliblari (eng ko'p ovoz olganlar), bajarilish holati.

## 4. Admin funksiyalari — TO'LIQ
1. **Loyihalar navbati (moderatsiya)** — kelgan tashabbuslar:
   - Filtr: viloyat/tuman/kategoriya/holat/mavsum.
   - Tasdiqlash (ovozga qo'yish) yoki **rad etish** (sabab bilan — masalan "shaxsiy ehtiyoj").
2. **Loyiha ustida ish** — ko'rish, smeta tekshirish, holatni o'zgartirish, izoh, g'olib belgilash.
3. **Byudjet boshqaruvi** — har tuman/shaharga ajratilgan byudjet, sarflangan/qolgan, loyiha soni limiti (10–30).
4. **Mavsum boshqaruvi** — mavsum ochish/yopish, ovoz berish davrini boshqarish, g'oliblarni aniqlash.
5. **Bajarilish nazorati** — g'olib loyiha holati: `moliyalashtirildi → bajarilmoqda → bajarildi`.
6. **Kategoriyalar / mahallalar** — oddiy CRUD/ma'lumotnoma.
7. **Analitika dashboardi** (6-bo'lim).

## 5. Ma'lumotlar modeli
```
Project      { id, projectNumber, title, description, category, region, district, mahalla,
               budget_uzs, votesCount, season, status(korib_chiqilmoqda|ovoz_berishda|
               golib|rad_etildi|moliyalashtirildi|bajarilmoqda|bajarildi),
               authorJshshir, rejectReason?, createdAt }
Vote         { id, projectId, voterJshshir, createdAt }   // 1 kishi 1 loyiha (unique: project+voter)
Season       { id, name, year, no(1|2), votingFrom, votingTo, status(aktiv|yopilgan) }
DistrictBudget { id, region, district, season, allocated_uzs, spent_uzs, projectLimit }
Category     { id, name, accentColor }   // yo'l, maktab, yoritish...
ProjectEvent { id, projectId, status, comment, createdAt }  // timeline
```

## 6. Analitika va hisobotlar (DASHBOARD)
**KPI kartalar:**
- Jami loyihalar (joriy mavsum)
- G'olib loyihalar
- Jami ovozlar
- Ajratilgan byudjet (so'm)
- Bajarilgan loyihalar ulushi (%)

**Diagrammalar:**
- **Kategoriyalar bo'yicha loyihalar** — *gorizontal bar* (real: yo'l ~40%, maktab ~30%, yoritish/suv kamroq)
- **Viloyatlar bo'yicha byudjet taqsimoti** — *bar*
- **Oylik ovozlar dinamikasi (mavsum davomida)** — *line/area* (ovoz berish davrida cho'qqi)
- **Loyiha holati taqsimoti** — *donut* (taklif/ovozda/g'olib/rad/bajarilgan)
- **Top mahallalar (eng faol)** — *bar* (qaysi mahalladan ko'p loyiha/ovoz)
- **Byudjet: ajratilgan vs sarflangan** — *combo (bar+line)*

**"Savolga javob" misollari (demo'da so'raladi):**
- *"Eng ko'p loyiha qaysi kategoriyada?"* → bar yetakchisi (odatda yo'l)
- *"Qaysi viloyatga eng ko'p byudjet ketdi?"* → bar yetakchisi
- *"Bu mavsumda nechta loyiha g'olib bo'ldi?"* → KPI + donut
- *"Qaysi mahalla eng faol?"* → top mahallalar bar

## 7. Demo seed data
- ~**400–600 loyiha** (2–3 mavsumga tarqalган, 14 viloyat/tuman/mahalla).
- Kategoriya nisbati realistik: **yo'l ~40%, maktab ~30%, yoritish/suv/bog'/sport/ko'kalamzor — qolgani**.
- Har loyihaga ovozlar: **50 dan bir necha mingacha** (g'oliblar ko'p ovozli).
- Statuslar aralash: ko'rib chiqilmoqda / ovoz berishda / g'olib / rad etilgan / moliyalashtirilgan / bajarilgan.
- Realistik smeta: **100 mln – 1.6 mlrd so'm** (yo'l/maktab odatda 300–900 mln).
- Har tuman byudjeti ~**15–45 mlrd so'm**, loyiha limiti 10–30.
- Bir nechta rad etilgan ("shaxsiy ehtiyoj" sababli — demo'da ko'rinsin).
- 1 demo fuqaro ("One ID") — 1 loyiha taklif qilgan + 2–3 ga ovoz bergan.

## 8. Real integratsiya nuqtalari
- One ID orqali fuqaroni autentifikatsiya (ovoz berishda takrorni bloklash).
- SMS shlyuzi (real ovoz tasdiqlash kodi).
- Byudjet/g'aznachilik tizimi bilan integratsiya (real moliyalashtirish).
- Hokimlik/mahalla reyestri bilan bog'lanish.

## 9. Modullararo bog'lanish (bonus — demo'ni jonlantiradi)
> Qattiq bog'lanish yo'q — faqat `category`/`jshshir`/havola orqali.

- **Obodonlashtirish → Murojaat:** infratuzilma muammosi (buzilgan yo'l, yoritish yo'q) —
  fuqaro avval **Murojaat/shikoyat** yuboradi (`category=obodonlashtirish`), keyin u
  loyiha tashabbusiga aylanishi mumkin. Demo ssenariysi: shikoyat → loyiha taklifi → ovoz.
- **Obodonlashtirish ↔ Soliq:** loyiha byudjeti soliq tushumidan keladi degan g'oya —
  dashboard'da "soliq tushumi → obodonlashtirish byudjeti" hikoyasi (faqat ko'rsatma matn).
- **Obodonlashtirish ↔ Yoshlar:** yosh tashabbuskorlar loyiha taklif qiladi — Yoshlar moduli
  `entrepreneur`/faol yosh statusiga ishora qilishi mumkin (kelajak bonus).

---
> **Tezlik maslahati:** KPI kartalar, viloyat/kategoriya bar grafiklari, filtrlanuvchi jadval va
> status timeline — Soliq modulida qurilgan komponentlardan. Faqat "ovoz berish" oqimi va
> "byudjet taqsimoti" bu modulga xos — shularni yangi yozasiz, qolgani qayta ishlatiladi.
