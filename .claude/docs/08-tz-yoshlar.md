# 08 — TZ: Yoshlar ishlari moduli

> Real prototip: **Yoshlar ishlari agentligi**, **"Yoshlar balansi"** (yashil/sariq/qizil tasnifi),
> **"Yoshlar daftari"** (ijtimoiy yordamga muhtoj yoshlar reyestri), `e-yoshlar.uz`.
> Bu modul **oxirida** quriladi — KPI/grafik/jadval patternlari oldingi 2 moduldan tayyor.
>
> G'oya: bu **registr + monitoring** moduli. Har bir yosh (14–30 yosh) holati kuzatiladi —
> **ishlayotgan / o'qiyotgan / harbiy xizmatda / uyda (ishsiz) / yordamga muhtoj** — va
> avtomatik ravishda **yashil / sariq / qizil** toifaga ajratiladi. Bu — real "Yoshlar balansi"ning aynan o'zi.

---

## 1. Maqsad
Davlat har bir yoshning (14–30 yosh) ijtimoiy holatini **monitoring** qiladi: u ishlaydimi,
o'qiydimi, harbiy xizmatdami, uyda ishsizmi yoki yordamga muhtojmi. Tizim har bir yoshni
holatiga qarab **yashil/sariq/qizil** toifaga ajratadi va yordamga muhtojlarni (qizil/sariq)
"Yoshlar daftari"ga oladi, subsidiya/yordam dasturlariga yo'naltiradi. Mahalladagi
**yoshlar yetakchisi** va Agentlik admin sifatida ishlaydi.

## 2. Asosiy tushunchalar
- **Yosh (youth)** — **14–30 yoshdagi** fuqaro (qonun bo'yicha). `jshshir` orqali aniqlanadi.
- **Holat (status)** — yoshning asosiy ijtimoiy holati:
  - `employed` (ishlayotgan), `studying` (o'qiyotgan), `military` (harbiy xizmatda),
    `unemployed` (uyda / ishsiz), `entrepreneur` (tadbirkor), `social_support` (yordamga muhtoj),
    `unable` (mehnatga layoqatsiz).
- **Toifa (category)** — holat + ijtimoiy vaziyatdan **avtomatik** hisoblanadi:
  - **Yashil (green)** — barqaror (ishlayotgan/o'qiyotgan, muammosiz). ~60%.
  - **Sariq (yellow)** — e'tibor talab (vaqtincha ishsiz, yordam kerak bo'lishi mumkin). ~37%.
  - **Qizil (red)** — jiddiy muammo (uzoq ishsiz, og'ir ijtimoiy holat, shoshilinch aralashuv). ~2-3%.
- **Yoshlar daftari (youth notebook)** — yordamga muhtoj yoshlar ro'yxati (qizil/sariq toifa ichidan).
- **Yoshlar yetakchisi (youth leader)** — har mahalladagi mas'ul (yoshlarni aniqlaydi, kuzatadi).
- **Bandlik (employment)** — ish bilan ta'minlanganlik. NEET — na ishlayotgan, na o'qiyotgan.
- **Yordam dasturlari** — subsidiya (BHM da): bir martalik yordam (4×BHM), tadbirkorlik (75%),
  ijara (25×BHM), jihoz (40×BHM), o'qish to'lovi (50×BHM/yil).
- **BHM** — bazaviy hisoblash miqdori (**412 000 so'm**), barcha yordam summalari shunda.

## 3. Client (fuqaro / yetakchi) funksiyalari — SODDA
1. **Mening holatim** (fuqaro) — yoshning o'z kartochkasi: holat, toifa (yashil/sariq/qizil), mahalla.
2. **Yordam dasturlari** — mavjud subsidiyalar ro'yxati + shartlari (BHM da).
3. **Yordamga ariza** — dastur tanlab ariza yuborish (mock) → holat = `ko'rib chiqilmoqda`.
4. **Mening arizalarim** — yuborilgan yordam arizalari + holati (timeline bilan).
5. **Yoshlar yetakchisi paneli** (mahalla darajasi, soddaroq admin):
   - O'z mahallasidagi yoshlar ro'yxati + toifa rangi.
   - Yangi yosh qo'shish / holatini yangilash.

## 4. Admin funksiyalari — TO'LIQ (Agentlik darajasi)
1. **Yoshlar reyestri** — barcha yoshlar (filtr: viloyat/tuman/mahalla/holat/toifa, qidiruv JSHSHIR/ism).
2. **Yosh kartochkasi** — to'liq ma'lumot + holat tarixi + toifa + yordam arizalari.
3. **Toifa monitoringi** — yashil/sariq/qizil taqsimoti, qizil toifadagilar alohida ro'yxat (e'tibor!).
4. **Yoshlar daftari** — yordamga olingan yoshlar, dastur turi, ajratilgan summa.
5. **Yordam arizalari navbati** — kelgan arizalar (status workflow), tasdiqlash/rad.
6. **Holatni ommaviy yangilash** — yoshning holati o'zgarsa toifa avtomatik qayta hisoblanadi.
7. **Yoshlar yetakchilari** — mahalla yetakchilari ro'yxati (oddiy CRUD).
8. **Analitika dashboardi** (6-bo'lim).

## 5. Ma'lumotlar modeli
```
Youth        { id, jshshir, fullName, birthDate, age, gender, region, district, mahalla,
               status(employed|studying|military|unemployed|entrepreneur|social_support|unable),
               category(green|yellow|red), inNotebook(bool), youthLeaderId?, createdAt }
StatusEvent  { id, youthId, status, category, comment, createdAt }   // holat tarixi
SupportRequest { id, requestNumber, youthId, programType, amount_uzs, status(yangi|
               korib_chiqilmoqda|tasdiqlandi|rad_etildi), createdAt }
SupportProgram { id, name, programType, capBhm, percent?, description }  // subsidiya turlari
YouthLeader  { id, fullName, region, district, mahalla, phone }
```
> **Toifa avtomatik hisoblanadi** (service ichida): `employed/studying/entrepreneur/military` → ko'pincha
> `green`; `unemployed` (qisqa) → `yellow`; uzoq `unemployed`/`social_support`/`unable` → `red`. Aniq
> qoidani service'da `computeCategory(youth)` funksiyasi belgilaydi (kelajakda real mezon bilan almashtiriladi).

## 6. Analitika va hisobotlar (DASHBOARD)
**KPI kartalar:**
- Jami yoshlar (14–30)
- Ishlayotganlar ulushi (%)
- Qizil toifa (e'tibor talab) — soni
- Yoshlar daftaridagilar — soni
- Bu oy ajratilgan yordam (so'm)

**Diagrammalar:**
- **Holat taqsimoti** (ishlayotgan/o'qiyotgan/harbiy/ishsiz/yordam...) — *donut yoki bar*
- **Toifa taqsimoti (yashil/sariq/qizil)** — *donut* (rang xaritasi to'g'ri: green/amber/red)
- **Viloyatlar bo'yicha ishsizlik/NEET** — *bar* (qaysi viloyatda eng yuqori — masalan Xorazm)
- **Bandlik dinamikasi (12 oy)** — *line/area* (ishlayotganlar ulushi o'sib bormoqda)
- **Yosh guruhlari** (14–17 / 18–22 / 23–30) — *bar*
- **Yordam dasturlari bo'yicha taqsimot** — *bar* (qaysi subsidiya ko'p so'raladi)

**"Savolga javob" misollari (demo'da so'raladi):**
- *"Qancha yosh qizil toifada?"* → KPI + donut (qizil ulush)
- *"Qaysi viloyatda yoshlar ishsizligi eng yuqori?"* → bar yetakchisi
- *"Yoshlar daftarida nechta yosh bor?"* → KPI + viloyat bo'yicha bar
- *"Bu oy qancha yordam ajratildi?"* → KPI + dastur bo'yicha bar

## 7. Demo seed data
- ~**500–800 yosh** (14–30, 14 viloyat/tuman/mahallaga tarqalган), realistik o'zbek ismlari.
- Holat taqsimoti realistik: **ishlayotgan ~46%, o'qiyotgan ~20%, ishsiz ~10%, yordamga muhtoj ~10%,
  harbiy ~3%, tadbirkor + layoqatsiz — qolgani**.
- Toifa: **yashil ~60%, sariq ~37%, qizil ~2-3%** (avtomatik hisoblangan).
- ~80–120 yosh **Yoshlar daftarida** (yordam olgan/olayotgan).
- ~100 yordam arizasi (turli status, dastur turi).
- **12 oylik holat tarixi** (StatusEvent) — bandlik dinamikasi grafigi to'la ko'rinsin.
- Bir nechta mahalla yetakchisi.
- 1 demo fuqaro ("One ID") — bitta yosh sifatida, sariq toifada, 1 yordam arizasi bilan.

## 8. Real integratsiya nuqtalari
- One ID orqali yoshni autentifikatsiya.
- `e-yoshlar.uz` / Yoshlar balansi yagona platforma bilan integratsiya.
- Bandlik (Mehnat vazirligi), ta'lim, harbiy komissariat tizimlaridan real holat olish.
- `computeCategory` ni real yashil/sariq/qizil mezon (reg' lament) bilan almashtirish.
- Subsidiya summalari real BHM bilan (ijtimoiy shartnoma).

## 9. Modullararo bog'lanish (bonus — demo'ni jonlantiradi)
> Qattiq bog'lanish yo'q — faqat `jshshir`/havola orqali.

- **Yoshlar → Murojaat:** yordamга muhtoj yosh **Murojaat/ariza** yuborishi mumkin
  (`category=yoshlar`), admin uni ko'rib yordamга yo'naltiradi.
- **Yoshlar ↔ Soliq:** yosh tadbirkor (`entrepreneur`) Soliq modulida YaTT sifatida ko'rinadi
  (`jshshir` orqali) — yosh tadbirkorlar soliq imtiyozi hikoyasi.
- **Yoshlar ↔ Obodonlashtirish:** faol yoshlar obodonlashtirish loyihalarini taklif qiladi —
  "yosh tashabbuskorlar" dashboard insightи (faqat ko'rsatma).

---
> **Tezlik maslahati:** filtrlanuvchi reyestr, KPI kartalar, donut/bar grafiklar, status timeline —
> hammasi oldingi 2 moduldan tayyor. Bu modulga xos yangi narsa — **avtomatik toifa hisoblash**
> (`computeCategory`) va **yashil/sariq/qizil rang indikatori**. Qolgani qayta ishlatiladi.
