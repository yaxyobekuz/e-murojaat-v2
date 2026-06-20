import { Routes, Route, Navigate } from "react-router-dom";

import {
  YerDashboardPage,
  YerRegistryPage,
  YerRequestsPage,
} from "@/owner/features/yer";

const OwnerRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="yer" replace />} />
    <Route path="yer" element={<YerDashboardPage />} />
    <Route path="yer/reyestr" element={<YerRegistryPage />} />
    <Route path="yer/arizalar" element={<YerRequestsPage />} />
    <Route path="*" element={<Navigate to="yer" replace />} />
  </Routes>
);

export default OwnerRoutes;
