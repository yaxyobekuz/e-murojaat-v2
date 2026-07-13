// Boshqaruv paneli navigatsiyasi — rolga qarab. Owner hammasini, mansabdor faqat o'z ishini ko'radi.
import { Map, Users, Landmark, Home, SlidersHorizontal, UserCog, BarChart3 } from "lucide-react";

export const navForRole = (role) => {
  if (role === "owner")
    return [
      { title: "Xarita tahrirlash", url: "/boshqaruv", icon: Map, end: true },
      { title: "Ma'lumot kiritish", url: "/boshqaruv/malumot", icon: SlidersHorizontal },
      { title: "Aholi", url: "/boshqaruv/aholi", icon: Users },
      { title: "Mahalla yettiligi", url: "/boshqaruv/yettilik", icon: Landmark },
      { title: "Hisoblar", url: "/boshqaruv/hisoblar", icon: UserCog },
      { title: "Jadval", url: "/boshqaruv/jadval", icon: Home },
    ];
  return [
    { title: "Ko'rsatkichlar", url: "/boshqaruv/malumot", icon: BarChart3 },
    { title: "Xarita", url: "/boshqaruv/xarita", icon: Map },
  ];
};
