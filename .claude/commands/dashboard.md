---
description: Modul uchun analitika dashboardini qur yoki yaxshila
argument-hint: <modul-nomi>
---

`$ARGUMENTS` moduli uchun analitika dashboardini qur.

1. `.claude/skills/analitika-dashboard/SKILL.md` ni ishlat.
2. Tegishli TZ ning "Analitika va hisobotlar" bo'limini aniq bajar (barcha KPI va grafiklar).
3. Grafiklar `recharts` asosida; qayta ishlatiluvchi komponentlarni `shared/components/ui/` da yarat/ishlat (`shadcn/*` to'g'ridan-to'g'ri emas).
4. Filtr (viloyat/sana/tur) barcha KPI va grafiklarni yangilashini ta'minla.
5. Har grafik ostiga 1 qatorli "insight" matnini qo'sh ("savolga javob" uchun).
