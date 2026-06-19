import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/owner/pages/DashboardPage";
import ObodonlashtirishPage from "@/owner/pages/ObodonlashtirishPage";
import YoshlarPage from "@/owner/pages/YoshlarPage";
import { TalimDashboardPage } from "@/owner/features/talim";
import { IibDashboardPage } from "@/owner/features/iib";
import { FvvDashboardPage } from "@/owner/features/fvv";
import {
  YerDashboardPage,
  RegistryPage,
  RequestsPage,
  RequestWorkPage,
} from "@/owner/features/yer";
import {
  SvetDashboardPage,
  SubscribersPage,
  SubscriberDetailPage,
  SvetRequestsPage,
  SvetRequestWorkPage,
  ViolationsPage,
} from "@/owner/features/svet";
import {
  MurojaatDashboardPage,
  AppealsPage,
  AppealWorkPage,
  OrganizationsPage,
} from "@/owner/features/murojaat";
import {
  GazDashboardPage,
  SubscribersPage as GazSubscribersPage,
  SubscriberCardPage as GazSubscriberCardPage,
  RequestsPage as GazRequestsPage,
  RequestWorkPage as GazRequestWorkPage,
  PaymentsPage as GazPaymentsPage,
  DebtPage as GazDebtPage,
} from "@/owner/features/gaz";
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

    {/* Gaz moduli */}
    <Route path="soliq/gaz" element={<GazDashboardPage />} />
    <Route path="soliq/gaz/abonentlar" element={<GazSubscribersPage />} />
    <Route path="soliq/gaz/abonentlar/:id" element={<GazSubscriberCardPage />} />
    <Route path="soliq/gaz/arizalar" element={<GazRequestsPage />} />
    <Route path="soliq/gaz/arizalar/:id" element={<GazRequestWorkPage />} />
    <Route path="soliq/gaz/tolovlar" element={<GazPaymentsPage />} />
    <Route path="soliq/gaz/qarzdorlar" element={<GazDebtPage />} />

    {/* Yer moduli */}
    <Route path="soliq/yer" element={<YerDashboardPage />} />
    <Route path="soliq/yer/reyestr" element={<RegistryPage />} />
    <Route path="soliq/yer/arizalar" element={<RequestsPage />} />
    <Route path="soliq/yer/arizalar/:id" element={<RequestWorkPage />} />

    {/* Elektr (Svet) moduli */}
    <Route path="soliq/elektr" element={<SvetDashboardPage />} />
    <Route path="soliq/elektr/abonentlar" element={<SubscribersPage />} />
    <Route path="soliq/elektr/abonentlar/:id" element={<SubscriberDetailPage />} />
    <Route path="soliq/elektr/arizalar" element={<SvetRequestsPage />} />
    <Route path="soliq/elektr/arizalar/:id" element={<SvetRequestWorkPage />} />
    <Route path="soliq/elektr/qoidabuzarliklar" element={<ViolationsPage />} />

    {/* Murojaat moduli */}
    <Route path="murojaat" element={<MurojaatDashboardPage />} />
    <Route path="murojaat/inbox" element={<AppealsPage />} />
    <Route path="murojaat/inbox/:id" element={<AppealWorkPage />} />
    <Route path="murojaat/tashkilotlar" element={<OrganizationsPage />} />

    <Route path="obodonlashtirish" element={<ObodonlashtirishPage />} />
    <Route path="yoshlar" element={<YoshlarPage />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
