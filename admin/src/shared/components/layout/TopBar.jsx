import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Search, X, Check } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import ThemeToggle from "@/shared/components/ui/theme/ThemeToggle";
import topbarModules from "./topbar.config";

// Aktiv link = oq pill
const linkClass = ({ isActive }) =>
  cn(
    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
    isActive
      ? "bg-white text-zinc-900 shadow-sm"
      : "text-foreground/60 hover:text-foreground",
  );

// Modulning barcha base yo'llari (bir nechta marshrutni qamragan modul uchun bases[])
const basesOf = (m) => m.bases || [m.base];

// URL qaysi modulga tegishli ekanini topadi (eng uzun mos base)
const moduleForPath = (pathname) =>
  topbarModules
    .flatMap((m) => basesOf(m).map((base) => ({ m, base })))
    .sort((a, b) => b.base.length - a.base.length)
    .find(({ base }) => pathname.startsWith(base))?.m || topbarModules[0];

const TopBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const current = moduleForPath(pathname);

  // Modul tanlanganda uning birinchi bo'limiga o'tamiz
  const switchModule = (m) => {
    setPickerOpen(false);
    setMobileOpen(false);
    if (m.key !== current.key) navigate(m.items[0].url);
  };

  return (
    <header className="sticky top-0 z-30 surface-overlay rounded-none border-x-0 border-t-0">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-6">
        {/* Modul tanlagich (doim ko'rinadi) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-card/60"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-brand-purple/15 text-brand-purple">
              <current.icon className="size-[18px]" strokeWidth={2} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">{current.title}</span>
            <ChevronDown
              className={cn("size-4 text-foreground/50 transition-transform", pickerOpen && "rotate-180")}
            />
          </button>

          {pickerOpen && (
            <>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setPickerOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div className="surface absolute left-0 top-12 z-20 w-56 animate-in fade-in slide-in-from-top-1 p-1.5 shadow-xl">
                {topbarModules.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => switchModule(m)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-card/70",
                      m.key === current.key ? "font-medium text-foreground" : "text-foreground/70",
                    )}
                  >
                    <span className="grid size-7 place-items-center rounded-md bg-brand-purple/15 text-brand-purple">
                      <m.icon className="size-4" strokeWidth={2} />
                    </span>
                    <span className="flex-1">{m.title}</span>
                    {m.key === current.key && <Check className="size-4 text-brand-purple" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Joriy modul ichki bo'limlari (desktop) */}
        <nav className="hidden items-center gap-1 rounded-full border border-[rgb(var(--card-border))] bg-card/50 p-1 md:flex">
          {current.items.map((item) => (
            <NavLink key={item.url} to={item.url} end={item.end} className={linkClass}>
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* O'ng amallar */}
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
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-[rgb(var(--card-border))] bg-card/60 text-foreground/70 md:hidden"
          >
            {mobileOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      {/* Mobil nav — joriy modul bo'limlari */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-[rgb(var(--card-border))] px-4 py-3 md:hidden">
          {current.items.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  isActive ? "bg-white text-zinc-900" : "text-foreground/70",
                )
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default TopBar;
