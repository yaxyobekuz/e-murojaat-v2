import { Routes, Route, Navigate } from "react-router-dom";

import {
  YerDashboardPage,
  YerRegistryPage,
  YerRequestsPage,
} from "@/owner/features/yer";
import {
  SoliqDashboardPage,
  SoliqBusinessesPage,
  SoliqDebtorsPage,
} from "@/owner/features/soliq";
import {
  ObodDashboardPage,
  ObodProjectsPage,
} from "@/owner/features/obodonlashtirish";
import { TalimDashboardPage } from "@/owner/features/talim";
import { IibDashboardPage, IibMapPage } from "@/owner/features/iib";
import { FvvDashboardPage, FvvMapPage } from "@/owner/features/fvv";
import { YoshlarDashboardPage } from "@/owner/features/yoshlar";

const OwnerRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="yer" replace />} />
    <Route path="yer" element={<YerDashboardPage />} />
    <Route path="yer/reyestr" element={<YerRegistryPage />} />
    <Route path="yer/arizalar" element={<YerRequestsPage />} />
    <Route path="soliq" element={<SoliqDashboardPage />} />
    <Route path="soliq/bizneslar" element={<SoliqBusinessesPage />} />
    <Route path="soliq/qarzdorlar" element={<SoliqDebtorsPage />} />
    <Route path="obodonlashtirish" element={<ObodDashboardPage />} />
    <Route path="obodonlashtirish/loyihalar" element={<ObodProjectsPage />} />
    <Route path="talim" element={<TalimDashboardPage />} />
    <Route path="iib" element={<IibDashboardPage />} />
    <Route path="iib/xarita" element={<IibMapPage />} />
    <Route path="fvv" element={<FvvDashboardPage />} />
    <Route path="fvv/xarita" element={<FvvMapPage />} />
    <Route path="yoshlar" element={<YoshlarDashboardPage />} />
    <Route path="*" element={<Navigate to="yer" replace />} />
  </Routes>
);

export default OwnerRoutes;
