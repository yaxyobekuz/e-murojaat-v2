# Modullar hisoboti — Soliq · Obodonlashtirish · Yoshlar

> Qisqa feature hisoboti. Barcha modullar `admin/src/owner/features/<modul>/` ichida.
> Hudud: **Baliqchi tumani, Andijon** (demo). Ma'lumot — deterministik mock (backend yo'q).
> Xarita — Google Maps 3D (Photorealistic) + API kalitsiz SVG fallback.

---

## 1. Soliq — biznes soliq monitoringi

**Route'lar:** `/owner/soliq` (Analitika) · `/owner/soliq/bizneslar` · `/owner/soliq/qarzdorlar`

| Feature | Tavsif |
|---|---|
| **3D biznes xaritasi** | ~74 biznes, faoliyat turi ikonkasi bilan; yig'im darajasi rangida (qarzdor=qizil). Bosilsa kamera flyTo + statistika paneli |
| **4 xarita rejimi** | Xarita (markerlar) · Ro'yxat · Issiqlik xaritasi (heatmap) · Klasterlar (guruhlash) |
| **5 KPI** | Jami bizneslar · Hisoblangan soliq · Yig'ilgan soliq · Qarzdorlik · Faoliyat yuritayotgan |
| **Checkbox filtrlar** | Barcha / Yirik to'lovchilar / Qarzdorlar / Yangi ochilganlar (xarita+ro'yxat birga filtrlanadi) |
| **Biznes paneli** | STIR, manzil, faoliyat turi, xodimlar, yillik soliq statistikasi + oylik dinamika grafigi |
| **Soliq tarixi modali** | 12 oylik jadval: Oy / Hisoblangan / Yig'ilgan / Qarz / Yig'im % |
| **Hudud paneli** | Mahalla blokini bosganda: bizneslar soni, hisoblangan/yig'ilgan/qarz, yig'im %, eng katta 3 qarzdor |
| **Bizneslar sahifasi** | Jadval + qidiruv + faoliyat turi chip filtri + o'ng panel |
| **Qarzdorlar sahifasi** | Faqat qarzdorlar (qarz bo'yicha) + KPI (qarzdor soni / umumiy qarz / kritik) |

**Asosiy fayllar:** `mock/soliq.businesses.js`, `mock/soliq.mapAreas.js`, `components/map/BusinessMap3D.jsx`, `pages/SoliqDashboardPage.jsx`

---

## 2. Obodonlashtirish — qurilish va ko'kalamzorlashtirish

**Route'lar:** `/owner/obodonlashtirish` (Analitika) · `/owner/obodonlashtirish/loyihalar`

| Feature | Tavsif |
|---|---|
| **3D loyihalar xaritasi** | 12 loyiha-zona (Voronoi grid). Holat rangida: rejada=ko'k, jarayonda=amber, yakunlangan=yashil |
| **Qurilish markerlari** | Jarayondagi loyihalar animatsiyali marker (aylanuvchi kran + puls halqa) bilan |
| **"Yashil maydonlar" rejimi** | Tugma bosilsa yashil zonalar + ekilgan daraxtlar soni qo'shiladi |
| **KPI overlay** | Loyihalar yig'indisi (byudjet, sarflangan, bajarilish) |
| **Qurilish paneli** | Jarayonda ketayotgan joylar ro'yxati; bosilsa xarita flyTo |
| **Info kartochka** | Loyiha bosilganda: turi, byudjet, sarflangan, progress, holat |
| **Loyihalar sahifasi** | DataTable: Loyiha / Turi / Byudjet / Sarflangan / Bajarilishi % / Holati |

**Loyiha turlari:** Yo'l · Park / dam olish · Ko'cha yoritish · Ko'kalamzorlashtirish · Suv ta'minoti
**Asosiy fayllar:** `mock/obod.projects.js`, `components/map/ObodMap3D.jsx`, `pages/ObodDashboardPage.jsx`

---

## 3. Yoshlar — Yoshlar Command Center (Analitika)

**Route'lar:** `/owner/yoshlar` (Analitika) · `/owner/yoshlar/loyihalar`
**Uslub:** dark + glassmorphism + cyan/blue accent, framer-motion animatsiya, 15 mahalla.

### Analitika sahifasi
| Feature | Tavsif |
|---|---|
| **10 KPI** | Jami yoshlar · Yoshlar daftari · Ishsiz · Talabalar · Tadbirkorlar · IT o'rganuvchilar · Til o'rganuvchilar · Migratsiya · Iqtidorli · Risk guruhi (count-up + pulse + 3D-tilt karta) |
| **3D mahalla xaritasi** | 15 mahalla; Youth Score (0-100) bo'yicha glow heatmap (risk=qizil, muvaffaqiyatli=yashil). Bosilsa kamera flyTo + panel |
| **Mahalla paneli** | Score, raqamlar, radar profil + **5 AI qatlami**: Risk darajasi · Imkoniyat indeksi · Bandlik prognozi (6 oy) · Migratsiya bosimi · AI karyera tavsiyasi |
| **Mahallalar reytingi** | Score bo'yicha ro'yxat; qatorga bossa xarita uchadi |
| **Radar (recharts)** | 6 o'q: Bandlik / Ta'lim / IT / Tadbirkorlik / Til / Salohiyat |
| **AI yordamchi (suzuvchi)** | Hudud bo'yicha AI xulosalari (risk/imkoniyat/migratsiya/prognoz) |
| **Mission Mode** | AI kamerani avtomatik eng muammoli mahallalarga olib boradi (flyTo + "keyingisi") |
| **10 strategik bo'lim** | Yoshlar balansi · Daftar · Bandlik · Ta'lim · Startaplar · Grantlar · Sport · Volontyorlik · Migratsiya · Kelajak liderlari |

### Loyihalar sahifasi
| Feature | Tavsif |
|---|---|
| **12 real loyiha** | Ibrat Farzandlari · Ustoz AI · UzCombinator · Qizlar Akademiyasi · Mutolaa · UzChess · Bir million dasturchi · Yoshlar daftari · Beshta tashabbus · Ta'lim grantlari · Yosh tadbirkor · Ijod maktabi |
| **Qamrov statistikasi** | Faol loyiha · Jami ishtirokchi · O'quv markazlari · Qabul ochiq |
| **Kategoriya filtri** | Ta'lim / IT / Tadbirkorlik / Til / Qizlar / Madaniyat (animatsiyali grid) |
| **3D loyiha kartalari** | Ikon + nom + tagline + ishtirokchi/mentor/markaz + progress + holat badge |
| **Batafsil panel** | Tavsif, qamrov, teglar, "ariza topshirish" |

**Asosiy fayllar:** `mock/youth.data.js`, `mock/youth.projects.js`, `components/map/YouthMap3D.jsx`, `components/AIAssistant.jsx`, `pages/YoshlarDashboardPage.jsx`

---

## Umumiy / qayta ishlatilgan

- **Google 3D loader** — soliq'da yozilgan (`soliq/utils/googleMaps3d.loader.js`), yoshlar shuni qayta ishlatadi.
- **Shared:** `GlassCard`, `GlassStatusBadge`, `DataTable`, recharts chartlar (`TrendChart`, `DonutChart`, ...), `useCountUp`, `useObjectState`.
- **Navigatsiya:** har modul topbar + sidebar'da; har bo'lim alohida tab/route.
- **Holat:** uchala modul **ishlaydi** (build ✅). Backend yo'q — barcha ma'lumot deterministik mock.

| Modul | Sahifalar | Xarita | KPI | Asosiy WOW |
|---|---|---|---|---|
| Soliq | 3 | 3D + 4 rejim | 5 | Issiqlik xaritasi, klaster, hudud paneli |
| Obodonlashtirish | 2 | 3D | overlay | Yashil maydon rejimi, animatsiyali kran |
| Yoshlar | 2 | 3D heatmap | 10 | AI qatlamlar, Mission Mode, AI yordamchi |
