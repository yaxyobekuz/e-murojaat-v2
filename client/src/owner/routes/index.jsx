import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/owner/pages/DashboardPage";
import { MySoliqPage } from "@/owner/features/soliq";
import {
  MyPropertiesPage,
  PropertyDetailPage,
  RegistryCheckPage,
  NewRequestPage,
  MyRequestsPage,
} from "@/owner/features/yer";
import {
  MyAccountPage,
  UsagePage,
  PaymentPage,
  SvetNewRequestPage,
  SvetMyRequestsPage,
} from "@/owner/features/svet";
import {
  NewAppealPage,
  MyAppealsPage,
  TrackAppealPage,
  FaqPage,
} from "@/owner/features/murojaat";
import {
  MyAccountPage as GazMyAccountPage,
  UsagePage as GazUsagePage,
  PaymentPage as GazPaymentPage,
  PaymentsHistoryPage as GazPaymentsHistoryPage,
  NewRequestPage as GazNewRequestPage,
  MyRequestsPage as GazMyRequestsPage,
  RegistryCheckPage as GazRegistryCheckPage,
} from "@/owner/features/gaz";

const OwnerRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="soliq" element={<MySoliqPage />} />

    <Route path="yer/mulklarim" element={<MyPropertiesPage />} />
    <Route path="yer/mulk/:id" element={<PropertyDetailPage />} />
    <Route path="yer/reyestr" element={<RegistryCheckPage />} />
    <Route path="yer/ariza" element={<NewRequestPage />} />
    <Route path="yer/arizalarim" element={<MyRequestsPage />} />

    <Route path="gaz/hisobim" element={<GazMyAccountPage />} />
    <Route path="gaz/sarf" element={<GazUsagePage />} />
    <Route path="gaz/tolov" element={<GazPaymentPage />} />
    <Route path="gaz/tolovlar" element={<GazPaymentsHistoryPage />} />
    <Route path="gaz/ariza" element={<GazNewRequestPage />} />
    <Route path="gaz/arizalarim" element={<GazMyRequestsPage />} />
    <Route path="gaz/tekshirish" element={<GazRegistryCheckPage />} />

    <Route path="elektr/hisobim" element={<MyAccountPage />} />
    <Route path="elektr/sarf" element={<UsagePage />} />
    <Route path="elektr/tolov" element={<PaymentPage />} />
    <Route path="elektr/ariza" element={<SvetNewRequestPage />} />
    <Route path="elektr/arizalarim" element={<SvetMyRequestsPage />} />

    <Route path="murojaat/yangi" element={<NewAppealPage />} />
    <Route path="murojaat/mening" element={<MyAppealsPage />} />
    <Route path="murojaat/holat" element={<TrackAppealPage />} />
    <Route path="murojaat/faq" element={<FaqPage />} />

    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
