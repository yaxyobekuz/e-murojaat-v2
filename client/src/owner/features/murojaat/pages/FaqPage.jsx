import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Card from "@/shared/components/ui/card/Card";

const FAQ = [
  {
    q: "Murojaat qancha muddatda ko'rib chiqiladi?",
    a: "Murojaatlar ma'muriy reglamentga muvofiq odatda 15 ish kuni ichida ko'rib chiqiladi. Murakkab masalalar bo'yicha muddat uzaytirilishi mumkin.",
  },
  {
    q: "Murojaat turlari nimadan farq qiladi?",
    a: "Ariza — biror xizmat yoki ma'lumot so'rovi; Shikoyat — huquq buzilishi yuzasidan norozilik; Taklif — tizimni yaxshilash bo'yicha g'oya.",
  },
  {
    q: "Murojaat holatini qanday kuzataman?",
    a: "Murojaat yuborilgach unikal raqam beriladi. \"Holatni tekshirish\" bo'limida shu raqam orqali holatni istalgan vaqtda ko'rishingiz mumkin.",
  },
  {
    q: "Javobdan norozi bo'lsam nima qilaman?",
    a: "Murojaat yopilgach natija (qanoatlantirildi/rad etildi/tushuntirildi) ko'rsatiladi. Norozi bo'lsangiz yuqori tashkilotga yangi shikoyat yuborishingiz mumkin.",
  },
  {
    q: "Murojaatim qaysi tashkilotga boradi?",
    a: "Tashkilotni o'zingiz tanlamasangiz, soha bo'yicha avtomatik tegishli organga (hokimlik, vazirlik yoki korxona) yo'naltiriladi.",
  },
];

const FaqItem = ({ item, isOpen, onToggle }) => (
  <Card className="!p-0">
    <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left">
      <span className="flex-1 text-sm font-medium text-zinc-900">{item.q}</span>
      <ChevronDown className={cn("size-5 text-zinc-300 transition", isOpen && "rotate-180")} />
    </button>
    {isOpen && (
      <p className="border-t p-4 pt-3 text-sm leading-relaxed text-zinc-600">{item.a}</p>
    )}
  </Card>
);

const FaqPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Savol-javob</h1>
      <p className="mb-5 text-sm text-zinc-500">Ko'p beriladigan savollar bo'yicha maslahatlar</p>

      <div className="space-y-2.5">
        {FAQ.map((item, i) => (
          <FaqItem
            key={i}
            item={item}
            isOpen={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
