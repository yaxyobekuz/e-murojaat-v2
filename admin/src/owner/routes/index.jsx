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
  ObodExecPage,
  AxlatPage,
  AssenizatsiyaPage,
  YashilMakonPage,
  HasharPage,
} from "@/owner/features/obodonlashtirish";
import { TalimDashboardPage, TalimDataPage, TalimStudentPage } from "@/owner/features/talim";
import { IibDashboardPage, IibMapPage } from "@/owner/features/iib";
import { FvvDashboardPage, FvvMapPage } from "@/owner/features/fvv";
import { YoshlarDashboardPage, YoshlarProjectsPage } from "@/owner/features/yoshlar";
import { ElektrDashboardPage } from "@/owner/features/elektr";
import { MskAnalyticsPage, MskAppealsPage } from "@/owner/features/msk";
import { GazAnalyticsPage, GazStreetsPage } from "@/owner/features/gaz";

const OwnerRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="yer" replace />} />
    <Route path="yer" element={<YerDashboardPage />} />
    <Route path="yer/reyestr" element={<YerRegistryPage />} />
    <Route path="yer/arizalar" element={<YerRequestsPage />} />
    <Route path="soliq" element={<SoliqDashboardPage />} />
    <Route path="soliq/bizneslar" element={<SoliqBusinessesPage />} />
    <Route path="soliq/qarzdorlar" element={<SoliqDebtorsPage />} />
    <Route path="obodonlashtirish" element={<ObodExecPage />} />
    <Route path="obodonlashtirish/xarita" element={<ObodDashboardPage />} />
    <Route path="obodonlashtirish/loyihalar" element={<ObodProjectsPage />} />
    <Route path="obodonlashtirish/axlat" element={<AxlatPage />} />
    <Route path="obodonlashtirish/assenizatsiya" element={<AssenizatsiyaPage />} />
    <Route path="obodonlashtirish/yashil-makon" element={<YashilMakonPage />} />
    <Route path="obodonlashtirish/hashar" element={<HasharPage />} />
    <Route path="talim" element={<TalimDashboardPage />} />
    <Route path="talim/malumotlar" element={<TalimDataPage />} />
    <Route path="talim/oquvchi/:id" element={<TalimStudentPage />} />
    <Route path="iib" element={<IibDashboardPage />} />
    <Route path="iib/xarita" element={<IibMapPage />} />
    <Route path="fvv" element={<FvvDashboardPage />} />
    <Route path="fvv/xarita" element={<FvvMapPage />} />
    <Route path="yoshlar" element={<YoshlarDashboardPage />} />
    <Route path="yoshlar/loyihalar" element={<YoshlarProjectsPage />} />
    <Route path="elektr" element={<ElektrDashboardPage />} />
    <Route path="msk" element={<MskAnalyticsPage />} />
    <Route path="msk/arizalar" element={<MskAppealsPage />} />
    <Route path="gaz" element={<GazAnalyticsPage />} />
    <Route path="gaz/kochalar" element={<GazStreetsPage />} />
    <Route path="*" element={<Navigate to="yer" replace />} />
  </Routes>
);

export default OwnerRoutes;
