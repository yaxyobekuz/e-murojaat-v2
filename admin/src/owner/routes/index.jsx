import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/owner/pages/DashboardPage";
import ObodonlashtirishPage from "@/owner/pages/ObodonlashtirishPage";
import YoshlarPage from "@/owner/pages/YoshlarPage";
import { TalimDashboardPage } from "@/owner/features/talim";
import { IibDashboardPage } from "@/owner/features/iib";
import { FvvDashboardPage } from "@/owner/features/fvv";

import {
  SoliqDashboardPage,
  TaxpayersListPage,
  TaxpayerDetailPage,
  DebtorsPage,
  AssessmentsPage,
} from "@/owner/features/soliq";

const OwnerRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />

    {/* Ta'lim moduli */}
    <Route path="talim" element={<TalimDashboardPage />} />

    {/* IIB moduli */}
    <Route path="iib" element={<IibDashboardPage />} />

    {/* FVV moduli */}
    <Route path="fvv" element={<FvvDashboardPage />} />

    {/* Soliq moduli */}
    <Route path="soliq" element={<SoliqDashboardPage />} />
    <Route path="soliq/taxpayers" element={<TaxpayersListPage />} />
    <Route path="soliq/taxpayers/:id" element={<TaxpayerDetailPage />} />
    <Route path="soliq/assessments" element={<AssessmentsPage />} />
    <Route path="soliq/debtors" element={<DebtorsPage />} />

    <Route path="obodonlashtirish" element={<ObodonlashtirishPage />} />
    <Route path="yoshlar" element={<YoshlarPage />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
