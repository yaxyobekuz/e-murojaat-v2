// Icons
import { ChevronLeft, ChevronRight, ChevronDown, ArrowLeftToLine } from "lucide-react";

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

// Utils
import { cn } from "@/shared/utils/cn";

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
              <SubItem
                key={subItem.title}
                item={subItem}
                pathname={pathname}
                onNavigate={isMobile ? toggleSidebar : undefined}
              />
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

// Modul ichidagi bo'lim. children bo'lsa — uchinchi daraja (ichki sahifalar) ochiladi.
const SubItem = ({ item, pathname, onNavigate }) => {
  const hasChildren = item.children?.length > 0;
  const childActive = hasChildren && item.children.some((c) => pathname === c.url);
  const [open, setOpen] = useState(childActive);

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          className="h-auto py-2"
          isActive={pathname === item.url}
        >
          <Link to={item.url} onClick={onNavigate}>
            {item.icon && <item.icon strokeWidth={1.5} />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          className="h-auto py-2"
          isActive={childActive}
          onClick={() => setOpen((v) => !v)}
        >
          {item.icon && <item.icon strokeWidth={1.5} />}
          <span>{item.title}</span>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className={cn(
              "ml-auto transition-transform group-data-[collapsible=icon]:hidden",
              open && "rotate-180",
            )}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>

      {open &&
        item.children.map((child) => (
          <SidebarMenuItem key={child.title} className="ml-3.5 border-l border-sidebar-border pl-2 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:pl-0">
            <SidebarMenuButton
              asChild
              tooltip={child.title}
              className="h-auto py-2"
              isActive={pathname === child.url}
            >
              <Link to={child.url} onClick={onNavigate}>
                {child.icon && <child.icon strokeWidth={1.5} />}
                <span>{child.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </>
  );
};

export default AppSidebar;
