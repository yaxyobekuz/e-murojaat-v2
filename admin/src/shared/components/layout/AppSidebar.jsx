// Icons
import { ChevronLeft, ChevronRight, ArrowLeftToLine } from "lucide-react";

// React
import { useState } from "react";

// Router
import { Link, useLocation } from "react-router-dom";

// Sidebar
import {
  Sidebar,
  useSidebar,
  SidebarRail,
  SidebarMenu,
  SidebarGroup,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/shared/components/shadcn/sidebar";

// Hooks
import useAuth from "@/shared/hooks/useAuth";
import usePermissions from "@/shared/hooks/usePermissions";
import { useIsMobile } from "@/shared/hooks/useMobile";

// Constants
import { ROLES } from "@/shared/constants/roles";

// Role-specific sidebar configurations
import { ownerSidebar } from "@/owner";
import { logoIcon } from "@/shared/assets/icons";

// Map a role value to its sidebar config. Add new entries here as new
// role panels are introduced (e.g. cloning `owner/` into another panel).
const ROLE_SIDEBAR = {
  [ROLES.OWNER]: ownerSidebar,
};

const AppSidebar = ({ ...props }) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <Header />
      <Main />
      <SidebarRail />
    </Sidebar>
  );
};

const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            onClick={() => toggleSidebar()}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <img
              width={32}
              alt="Logo"
              height={32}
              src={logoIcon}
              className="size-8"
            />

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Template</span>
            </div>
            <ArrowLeftToLine className="ml-auto" size={24} strokeWidth={1.5} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

const Main = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const { role } = useAuth();
  const { has } = usePermissions();
  const { pathname } = useLocation();

  const navItems = ROLE_SIDEBAR[role] || [];

  // Modullarni va ularning ichki bo'limlarini permission bo'yicha filtrlash
  const modules = navItems
    .map((item) => ({
      ...item,
      items: (item.items || []).filter(
        (sub) => !sub.permission || has(sub.permission),
      ),
    }))
    .filter((item) => item.items.length > 0);

  // Joriy URL qaysi modul ichida ekanini aniqlash (drill-in boshlang'ich holati)
  const activeModule = modules.find((m) =>
    m.items.some((sub) => pathname.startsWith(sub.url)),
  );

  const [openKey, setOpenKey] = useState(activeModule?.key ?? null);

  const current = modules.find((m) => m.key === openKey);

  // Modul ichida — drill-in ko'rinishi.
  // Ichki bo'limlar SidebarMenu (sub emas) bilan chiziladi — shunda icon
  // mode'da har bir bo'lim o'z ikonkasi + tooltip bilan ko'rinadi.
  if (current) {
    return (
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Orqaga"
                onClick={() => setOpenKey(null)}
                className="h-auto py-2.5 text-muted-foreground"
              >
                <ChevronLeft strokeWidth={1.5} />
                <span>Orqaga</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroupLabel className="mt-1 flex items-center gap-2">
            {current.icon && <current.icon size={16} strokeWidth={1.5} />}
            {current.title}
          </SidebarGroupLabel>

          {/* Ichma-ich ko'rinish: chap chiziq + indent (icon mode'da olib tashlanadi) */}
          <SidebarMenu className="ml-3.5 gap-px border-l border-sidebar-border px-2.5 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:px-0">
            {current.items.map((subItem) => (
              <SidebarMenuItem key={subItem.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={subItem.title}
                  className="h-auto py-2"
                  isActive={pathname === subItem.url}
                >
                  <Link
                    to={subItem.url}
                    onClick={isMobile ? toggleSidebar : undefined}
                  >
                    {subItem.icon && <subItem.icon strokeWidth={1.5} />}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    );
  }

  // Bosh menyu — modullar ro'yxati
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platforma</SidebarGroupLabel>
        <SidebarMenu>
          {modules.map((item) => (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                tooltip={item.title}
                className="h-auto py-2.5"
                onClick={() => setOpenKey(item.key)}
              >
                {item.icon && <item.icon strokeWidth={1.5} />}
                <span>{item.title}</span>
                <ChevronRight
                  size={20}
                  strokeWidth={1.5}
                  className="!size-5 ml-auto group-data-[collapsible=icon]:hidden"
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default AppSidebar;
