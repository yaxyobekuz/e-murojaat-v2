# 01 — TZ: Yer / Mol-mulk moduli

> Real prototip: **kadastr.uz**, **davreestr.uz** (Kadastr agentligi).
> Bu modul eng murakkabi — oxirida quring.

---

## 1. Maqsad
Fuqaro o'z ko'chmas mulki (uy, kvartira, yer uchastkasi) bo'yicha ma'lumot oladi,
kadastr hujjatlarini rasmiylashtirish uchun **onlayn ariza** beradi va holatini kuzatadi.
Davlat (admin) bu arizalarni ko'rib chiqadi va reyestrni boshqaradi.

## 2. Asosiy tushunchalar
- **Ko'chmas mulk obyekti** — uy / kvartira / yer / noturar obyekt.
- **Kadastr raqami** — obyektning yagona kodi (`10:01:01:01:0001`).
- **Kadastr pasporti / ko'chirma** — mulkka egalik tasdiqnomasi (hujjat).
- **Davlat ro'yxati (reyestr)** — barcha mulk va egalari yozilgan baza.
- **Servitut** — birovning yeridan cheklangan foydalanish huquqi.

## 3. Client (fuqaro) funksiyalari — SODDA
1. **Mening mulklarim** — JSHSHIR ga biriktirilgan obyektlar ro'yxati (kartochka ko'rinishida).
2. **Mulk tafsiloti** — kadastr raqami, manzil, maydon (m²), tur, egalik turi, qiymat, xaritada nuqta (mock).
3. **Reyestrdan ko'chirma tekshirish** — kadastr raqamini kiritib, mulk holatini ko'rish (ochiq xizmat).
4. **Ariza berish** (4–5 xizmat turi yetarli):
   - Kadastr pasportini rasmiylashtirish
   - Mulk ma'lumotlarini tahrirlash
   - Ijara shartnomasini ro'yxatdan o'tkazish
   - Servitut ro'yxatdan o'tkazish
5. **Arizalarim** — yuborilgan arizalar va ularning holati (timeline bilan).

## 4. Admin funksiyalari — TO'LIQ
1. **Reyestr boshqaruvi** — barcha obyektlar (jadval, filtr: viloyat/tur/holat, qidiruv).
2. **Arizalar navbati** — kelgan arizalar (status: yangi → ko'rib chiqilmoqda → o'lchov → to'lov → bajarildi/rad).
3. **Ariza ustida ish** — operator hujjatlarni ko'radi, holatni o'zgartiradi, izoh qoldiradi, invoys (to'lov) chiqaradi.
4. **Obyekt tahrirlash** — yangi mulk qo'shish/o'zgartirish.
5. **Analitika dashboardi** (5-bo'lim).

## 5. Ma'lumotlar modeli (entity lar)
```
Property        { id, cadastreNumber, type(uy|kvartira|yer|noturar), region, district,
                  address, area_m2, value_uzs, ownershipType, ownerJshshir, status, registeredAt }
Owner           { jshshir, fullName, phone, region }
PropertyRequest { id, requestNumber, propertyId?, serviceType, applicantJshshir,
                  status, createdAt, updatedAt, invoiceAmount?, paid(bool), operatorNote }
RequestEvent    { id, requestId, status, comment, createdAt }  // timeline uchun
```

## 6. Analitika va hisobotlar (DASHBOARD — bu yerga e'tibor)
**KPI kartalar (yuqori qator):**
- Jami ro'yxatga olingan obyektlar
- Bu oydagi yangi arizalar
- Ko'rib chiqilmoqda (kutilayotgan)
- O'rtacha ko'rib chiqish muddati (kun)

**Diagrammalar:**
- **Obyekt turlari** (uy/kvartira/yer/noturar) — *pie/donut chart*
- **Viloyatlar kesimida obyektlar soni** — *gorizontal bar chart*
- **Oylik arizalar dinamikasi (12 oy)** — *line/area chart*
- **Xizmat turlari bo'yicha arizalar** — *bar chart*
- **Arizalar holati taqsimoti** — *stacked bar yoki donut*

**"Savolga javob" misollari (demo'da so'raladi):**
- *"Andijonda nechta yer uchastkasi ro'yxatda?"* → filtr + raqam + bar
- *"Qaysi xizmat eng ko'p so'raladi?"* → bar chart yetakchisi

## 7. Demo seed data
- ~400 obyekt (turli viloyat/tur), realistik kadastr raqamlari va manzillar.
- ~250 ariza (12 oyga tarqalган, turli status).
- Har arizaga 2–4 ta RequestEvent (timeline to'la ko'rinsin).
- 1 ta demo fuqaro ("One ID") ga 3–4 obyekt biriktirilgan bo'lsin (login qilib ko'rsatish uchun).

## 8. Real integratsiya nuqtalari (kelajak)
- `KadastrProvider` interfeysi: real `davreestr.uz` API ga ulanadi.
- One ID orqali fuqaroni autentifikatsiya.
- Hujjat (kadastr pasporti) PDF generatsiyasi — gerbli shablon.
