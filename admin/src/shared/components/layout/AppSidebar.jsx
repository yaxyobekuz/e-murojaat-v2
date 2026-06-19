// Icons
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowLeftToLine,
} from "lucide-react";

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
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/shared/components/shadcn/sidebar";

// Dropdown Menu
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/shared/components/shadcn/dropdown-menu";

// Hooks
import useAuth from "@/shared/hooks/useAuth";
import useLogout from "@/features/auth/hooks/useLogout";
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
      <Footer />
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

  // Modul ichida — drill-in ko'rinishi
  if (current) {
    return (
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
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

          <SidebarMenuSub>
            {current.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  className="h-auto py-2"
                  asChild
                  isActive={pathname === subItem.url}
                >
                  <Link
                    to={subItem.url}
                    onClick={isMobile ? toggleSidebar : undefined}
                  >
                    {subItem.title}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
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
                  className="!size-5 ml-auto"
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

const Footer = () => {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const isMobile = useIsMobile();

  if (!user) return null;

  const initial = user.firstName?.[0] || user.username?.[0] || "?";

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex items-center justify-center size-8 shrink-0 bg-primary rounded-[2px] uppercase text-white">
                  {initial}
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.firstName || user.username}
                  </span>
                  <span className="truncate text-xs">{user.username}</span>
                </div>

                <ChevronRight
                  size={20}
                  strokeWidth={1.5}
                  className="ml-auto !size-5"
                />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={4}
              side={isMobile ? "bottom" : "right"}
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
            >
              <DropdownMenuLabel className="!p-0 font-normal">
                <div className="flex items-center gap-2 text-left text-sm">
                  <div className="flex items-center justify-center size-8 shrink-0 bg-primary rounded-[2px] uppercase text-white">
                    {initial}
                  </div>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.firstName || user.username}
                    </span>
                    <span className="truncate text-xs opacity-70">
                      {user.username}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => logout()}>
                <LogOut strokeWidth={1.5} />
                Chiqish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebar;
