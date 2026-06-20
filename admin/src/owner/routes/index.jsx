import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/owner/pages/DashboardPage";
import ObodonlashtirishPage from "@/owner/pages/ObodonlashtirishPage";
import YoshlarPage from "@/owner/pages/YoshlarPage";

const OwnerRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />

    <Route path="obodonlashtirish" element={<ObodonlashtirishPage />} />
    <Route path="yoshlar" element={<YoshlarPage />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
