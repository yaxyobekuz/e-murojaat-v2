# Qoida 02 — Dizayn tizimi

> Maqsad: 4 modul + admin + client **bitta yagona tizimdek** ko'rinsin. Toza, ishonchli,
> davlat darajasida jiddiy, lekin zamonaviy.

## Asosiy tamoyillar
- **Izchillik > kreativlik.** Bir xil komponent hamma joyda bir xil ko'rinadi.
- **Bo'sh joy (whitespace)** ko'p. Siqilgan emas.
- **Ma'lumot ustuvor.** Bezak emas, raqam va holat ko'rinarli.
- **Davlat ohangi:** sokin, ishonchli ranglar. Qichqirган gradient/animatsiya yo'q.

## Ranglar (palitra)
- **Asosiy (brand):** ko'k-siyohrang (davlat/ishonch) — masalan `#1E4FD8` atrofida.
- **Neytral:** kulrang shkala (slate) — fon, matn, chegara.
- **Holat ranglari:** success (yashil), warning (amber), danger (qizil), info (ko'k).
- **Modul accent ranglari** (faqat ikonka/badge uchun, asosiy palitra ustidan):
  - Yer/Mol-mulk → emerald (yashil)
  - Gaz → blue (ko'k)
  - Svet → amber (sariq)
  - Murojaat → violet (binafsha)
- Light mode default; dark mode ixtiyoriy (vaqt qolsa).

## Tipografika
- Sans-serif (Inter yoki tizim shrifti). 
- Shkala: `text-sm` (asosiy matn), `text-xs` (yordamchi), `text-lg/xl/2xl` (sarlavhalar).
- Raqamlar (statistika) — **tabular-nums**, og'irroq (`font-semibold`).

## Layout
- **AppShell:** chap sidebar (200–260px, modul navigatsiyasi) + tepa header + asosiy maydon.
- Sahifa kengligi: `max-w-7xl`, markazlashgan, `px-6`.
- Kartalar: `rounded-xl`, yumshoq soya (`shadow-sm`), `border` yengil.
- Spacing: 4px shkala (`gap-2/4/6`).

## Komponentlar (shadcn/ui asosida, hamma joyda bir xil)
- `Button` (primary/secondary/ghost/danger), `Card`, `Badge` (status ranglari),
  `Table`, `Input`, `Select`, `Tabs`, `Dialog`, `Toast`, `Skeleton`, `EmptyState`.
- **Status badge** — har doim bir xil rang xaritasi:
  - yangi=ko'k, jarayonda=amber, bajarildi=yashil, rad=qizil, muddati o'tdi=qizil-outline.

## Dashboard (analitika sahifasi) tartibi
1. Tepada **filtr paneli** (viloyat, sana oralig'i, tur/soha).
2. **KPI kartalar qatori** (3–5 ta) — katta raqam + o'sish/kamayish strelkasi.
3. **Grafiklar gridi** (2 ustun) — TrendChart, BreakdownBar, DonutChart...
4. Har grafik tepasida sarlavha, ostida 1 qatorli "insight" matni.
5. Pastda filtrlanuvchi **DataTable**.

## Grafik uslubi
- Yumshoq ranglar, qalin chiziq emas. Grid yengil kulrang.
- Tooltip har doim so'm/birlik formatlangan.
- Bo'sh ma'lumot bo'lsa — "Ma'lumot yo'q" empty state, qiyshiq grafik emas.

## Mikro-detallar
- Yuklanish — **skeleton** (spinner emas).
- Muvaffaqiyat/xato — **toast**.
- Hover/focus holatlari aniq. Klaviatura bilan yurish mumkin (a11y).
- Sana `DD.MM.YYYY`, pul `1 250 000 so'm` (bo'sh joy bilan).

> Yangi UI qurishdan oldin: `frontend-design` skill (agar mavjud bo'lsa) + shu qoidalar.
> Hech qachon "default bootstrap" ko'rinish — har doim shu tizim.
