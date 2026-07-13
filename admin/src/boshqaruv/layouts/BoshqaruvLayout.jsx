// Boshqaruv paneli qobig'i — owner sessiyasi bo'lmasa login'ga yo'naltiradi.
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Settings, ArrowLeft } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { qk } from "@/shared/lib/query/keys";
import { roleLabel } from "@/shared/constants/roles";
import { boshqaruvAuthAPI } from "../api/auth.api";
import { useBoshqaruvMe } from "../hooks/useBoshqaruvMe";
import { navForRole } from "../data/nav";

const BoshqaruvLayout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me, isLoading, isError } = useBoshqaruvMe();

  const onLogout = async () => {
    await boshqaruvAuthAPI.logout().catch(() => {});
    queryClient.removeQueries({ queryKey: qk.boshqaruv.me() });
    navigate("/boshqaruv/login", { replace: true });
  };

  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground/40">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );

  if (isError || !me) return <Navigate to="/boshqaruv/login" replace />;

  const NAV = navForRole(me.role);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-[rgb(var(--card-border))] bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-6">
          <button
            type="button"
            onClick={() => navigate("/owner/asosiy")}
            className="grid size-8 place-items-center rounded-lg border border-[rgb(var(--card-border))] text-foreground/55 transition-colors hover:text-foreground"
            title="Dashboardga qaytish"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            <Settings className="size-4.5 text-emerald-500" />
            <span className="text-sm font-bold tracking-tight">Boshqaruv paneli</span>
            {me.role !== "owner" && (
              <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-px text-[10px] font-semibold text-emerald-400">
                {roleLabel(me.role)}
              </span>
            )}
          </div>

          <nav className="ml-4 flex items-center gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.url}
                to={n.url}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                    isActive ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:text-foreground/80",
                  )
                }
              >
                <n.icon className="size-3.5" /> {n.title}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-foreground/50">
              <span className="font-semibold text-foreground/80">{me.fullName || me.username}</span> sifatida
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[rgb(var(--card-border))] px-2.5 py-1.5 text-xs font-medium text-foreground/60 transition-colors hover:text-red-400"
            >
              <LogOut className="size-3.5" /> Chiqish
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default BoshqaruvLayout;
