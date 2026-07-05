import { useEffect, useState } from "react";
import { GraduationCap, Network, Trees, Users, Wrench } from "lucide-react";

import { cn } from "@/shared/utils/cn";

const SECTIONS = [
  { id: "infratuzilma", label: "Infratuzilma", icon: Network },
  { id: "obodonlashtirish", label: "Obodonlashtirish", icon: Trees },
  { id: "msk", label: "MSK", icon: Wrench },
  { id: "talim", label: "Ta'lim", icon: GraduationCap },
  { id: "yoshlar", label: "Yoshlar", icon: Users },
];

// Yopishqoq bo'lim navigatsiyasi — scroll-spy bilan aktiv bo'lim belgilanadi
const SectionNav = () => {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <nav className="sticky top-16 z-20 w-fit max-w-full overflow-x-auto">
      <div className="surface-overlay flex items-center gap-1 rounded-full p-1.5">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              active === id
                ? "bg-white text-zinc-900"
                : "text-foreground/60 hover:bg-card/60 hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default SectionNav;
