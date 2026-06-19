# 09 — Shukurilloga boshlash qo'llanmasi

> Bu fayl — **senga maxsus** (Shukurillo). 3 ta modulingni (Soliq, Obodonlashtirish, Yoshlar)
> qaysi tartibda, qaysi buyruq bilan qurishni va davlat atamalarini sodda tilda tushuntiradi.
> Davlat tizimini bilmasang ham — shu yerdan boshla, hammasi qadam-baqadam.

---

## 1. Sening 3 moduling — bir qarashda

| Modul | Bir jumlada nima | Asosiy "fishka" | Rang |
|---|---|---|---|
| **Soliq** | Fuqaro soliqlarini ko'radi, qarz/penyani kuzatadi, to'laydi | Pul, tushum, qarzdorlik grafiklar | indigo |
| **Obodonlashtirish** | Fuqaro obodonlashtirish loyihasini taklif qiladi va ovoz beradi | Loyiha + byudjet + **ovoz berish** | teal |
| **Yoshlar** | Har bir yoshning holati kuzatiladi va toifaga ajratiladi | **Yashil/sariq/qizil** avtomatik tasnif | orange |

## 2. Qurish tartibi va NEGA aynan shunday

**1-chi: Soliq.** Sababi — eng "raqamli/pulli" modul. KPI kartalar, tushum/qarzdorlik
grafiklari, filtrlanuvchi reyestr, to'lov oqimi — bularning hammasi shu yerda quriladi va
keyingi 2 modulda **qayta ishlatiladi**. Demo egasi ham birinchi ko'rganda "wow" deydi
(pul, raqam, diagramma). Birinchi modulga ko'proq vaqt ket — bu investitsiya.

**2-chi: Obodonlashtirish.** KPI/grafik/jadval Soliq'dan tayyor. Bu modulga xos faqat
**ovoz berish oqimi** va **byudjet taqsimoti** — shularni yangidan yozasan, qolgani ko'chadi.

**3-chi: Yoshlar.** Hamma narsa oldingi 2 moduldan tayyor. Bu modulga xos faqat
**avtomatik toifa hisoblash** (`computeCategory` — yashil/sariq/qizil) va rang indikatori.

> Qoida: birinchi modulni qurganda umumiy narsalarni (grafik komponentlar, layout, analitika
> API patterni) `shared/` ga chiqar. Keyingi 2 modul 2-3 barobar tez bo'ladi.

## 3. Har modulni qaysi buyruq bilan qurish (workflow)

Har modul uchun **bir xil 4 qadam**. Misol — Soliq:

```
1. /yangi-modul soliq      → backend (model, service, handler, route) + admin + client skeleti
2. /seed soliq             → realistik demo ma'lumot (500 to'lovchi, 12 oy tarix, qarzdorlik)
3. /dashboard soliq        → analitika dashboardi (KPI + grafiklar + filtr)
4. /tekshir soliq          → "tayyor" mezonlariga (Definition of Done) mosligini tekshir
```

Keyin `obodonlashtirish` va `yoshlar` uchun ham xuddi shunday. Modul tugagach: `/push`.

> Buyruqlar `.claude/commands/` da, skill'lar `.claude/skills/` da. Ular modul nomini parametr
> oladi — yangi buyruq yozish shart emas, mavjudlari sening 3 modulingда ham ishlaydi.

## 4. Davlat atamalari — sodda tilda (qo'rqma, oson)

**Soliq:**
- **STIR** — soliq to'lovchining raqami (**9 ta raqam**). Telefon raqamiga o'xshaydi, lekin soliq uchun.
- **JSHSHIR (PINFL)** — fuqaroning yagona **14 xonali** raqami. Pasportda bor. Modullarni bog'lash kaliti.
- **Mol-mulk solig'i** — uy/kvartira uchun soliq. ≤200 m² uy → 0.34% (kadastr qiymatidan).
- **Penya** — kechikkanlik jarimasi: kuniga 0.033%. Har kun qarz ustiga oz-ozdan qo'shiladi.
- **BHM** — "bazaviy hisoblash miqdori" = **412 000 so'm**. Ko'p davlat summalari shu birlikda ("3×BHM" kabi).

**Obodonlashtirish:**
- **Tashabbusli byudjet** — fuqaro mahallasiga loyiha taklif qiladi, eng ko'p ovoz olgani pul oladi.
- **Mahalla** — eng kichik ma'muriy birlik (sizning ko'changiz/daha). O'zbekistonda ~9300 ta.
- **Mavsum** — yiliga 2 marta o'tadigan tsikl: taklif → moderatsiya → ovoz berish → g'olib.
- **Min 50 ovoz** — loyiha g'olib bo'lishi uchun kamida 50 kishi ovoz berishi kerak.
- **Smeta** — loyiha qiymati. Limit BHM da (qurilish ≤ 4000×BHM ≈ 1.6 mlrd so'm).

**Yoshlar:**
- **Yoshlar balansi** — real tizim: har bir yoshni (14–30) holatiga qarab **yashil/sariq/qizil** ga ajratadi.
- **Yashil** = yaxshi (ishlayapti/o'qiyapti). **Sariq** = e'tibor kerak. **Qizil** = jiddiy muammo (yordam shart).
- **Yoshlar daftari** — yordamga muhtoj yoshlar ro'yxati (qizil/sariq'dan).
- **Yoshlar yetakchisi** — har mahalladagi mas'ul (yoshlarni kuzatadi, ro'yxatga oladi).
- **NEET** — na ishlayotgan, na o'qiyotgan yosh (ingliz qisqartmasi; "uyda" deganga yaqin).

## 5. Demo "hikoya"si — loyiha egasiga ko'rsatish ssenariysi

Demo'da raqam va grafikdan tashqari **bitta jonli hikoya** kuchli ta'sir qiladi. Tavsiya:

> **"One ID" fuqaro** (demo foydalanuvchi) login qiladi →
> 1. **Soliq:** o'z mol-mulk solig'ini ko'radi, qarzi bor, penya o'sayapti → "To'lash" bosadi → qarz yo'qoladi.
> 2. **Murojaat (Yaxyobek):** qarz noto'g'ri deb o'ylasa, shikoyat yuboradi (`category=soliq`).
> 3. **Obodonlashtirish:** o'z mahallasidagi "ko'cha yoritish" loyihasiga ovoz beradi.
> 4. **Yoshlar:** agar yosh bo'lsa — o'z holatini (sariq toifa) ko'radi, yordam dasturiga ariza beradi.

Keyin **admin** sifatida kirib, har modulning dashboardini ko'rsat:
- *"Qaysi viloyatda qarzdorlik eng yuqori?"* → Soliq bar grafigi.
- *"Eng ko'p loyiha qaysi kategoriyada?"* → Obodonlashtirish bar (yo'l yetakchi).
- *"Qancha yosh qizil toifada?"* → Yoshlar donut.

Bu modullararo bog'lanish (Soliq qarzi → Murojaat shikoyati; loyihaga ovoz) — demo'ni **bir tizimdek** ko'rsatadi.

## 6. Eslatma — har doim eslab qol
- **UI matni** — o'zbekcha; **kod qiymatlari** (status, role, key) — inglizcha.
- **Grafik kerakmi?** Avval `shared/components/ui/` da bor-yo'qligini tekshir — qayta yozma (DRY).
- **Mock chegarasi:** to'lov/SMS/One ID — mock, lekin service interfeysini toza qoldir (kelajakda real API).
- **Realistik seed** — bo'sh dashboard demo'ni o'ldiradi. Har modulda 12 oy tarix + turli holat shart.
- Batafsil texnik qoidalar: `rules/01` (kod), `rules/02` (dizayn), `rules/03` (modul), `server/CLAUDE.md`, `client/CLAUDE.md`.

---
> Tayyor bo'lsang: **`/yangi-modul soliq`** dan boshla. Omad! 🚀
