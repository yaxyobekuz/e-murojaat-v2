// Router
import { Routes as RoutesWrapper, Route, Navigate } from "react-router-dom";

// Layouts
import TopBarLayout from "@/shared/layouts/TopBarLayout";

// Role panels
import { OwnerRoutes } from "@/owner";
import { BoshqaruvLayout, BoshqaruvLoginPage, BoshqaruvXaritaPage, BoshqaruvAholiPage } from "@/boshqaruv";
import { XonadonlarPage } from "@/owner/features/asosiy";

const Routes = () => (
  <RoutesWrapper>
    <Route element={<TopBarLayout />}>
      <Route path="/owner/*" element={<OwnerRoutes />} />
      <Route path="/" element={<Navigate to="/owner" replace />} />
    </Route>

    {/* Boshqaruv paneli — owner login/paroli bilan himoyalangan alohida panel */}
    <Route path="/boshqaruv/login" element={<BoshqaruvLoginPage />} />
    <Route path="/boshqaruv" element={<BoshqaruvLayout />}>
      <Route index element={<BoshqaruvXaritaPage />} />
      <Route path="aholi" element={<BoshqaruvAholiPage />} />
      <Route path="jadval" element={<XonadonlarPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/owner" replace />} />
  </RoutesWrapper>
);

export default Routes;
