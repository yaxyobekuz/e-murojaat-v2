import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Map, Menu, Search, X } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import ThemeToggle from "@/shared/components/ui/theme/ThemeToggle";

const NAV = [
  { to: "/owner/yer", label: "Analitika", end: true },
  { to: "/owner/yer/reyestr", label: "Reyestr" },
  { to: "/owner/yer/arizalar", label: "Arizalar" },
];

// Active link = solid white pill (reference look)
const linkClass = ({ isActive }) =>
  cn(
    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
    isActive
      ? "bg-white text-zinc-900 shadow-sm"
      : "text-foreground/60 hover:text-foreground",
  );

const TopBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 surface-overlay rounded-none border-x-0 border-t-0">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-purple/15 text-brand-purple">
            <Map className="size-[18px]" strokeWidth={2} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Yer kadastri</span>
        </div>

        {/* Center pill nav (desktop) */}
        <nav className="hidden items-center gap-1 rounded-full border border-[rgb(var(--card-border))] bg-card/50 p-1 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Qidirish"
            className="hidden size-9 place-items-center rounded-full border border-[rgb(var(--card-border))] bg-card/60 text-foreground/70 hover:text-foreground md:grid"
          >
            <Search className="size-[18px]" strokeWidth={1.75} />
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menyu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-[rgb(var(--card-border))] bg-card/60 text-foreground/70 md:hidden"
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-[rgb(var(--card-border))] px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  isActive ? "bg-white text-zinc-900" : "text-foreground/70",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default TopBar;
