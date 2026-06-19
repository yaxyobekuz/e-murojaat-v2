import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/owner/pages/DashboardPage";
import SoliqPage from "@/owner/pages/SoliqPage";
import SoliqGazPage from "@/owner/pages/SoliqGazPage";
import SoliqSuvPage from "@/owner/pages/SoliqSuvPage";
import SoliqElektrPage from "@/owner/pages/SoliqElektrPage";
import SoliqYerPage from "@/owner/pages/SoliqYerPage";
import ObodonlashtirishPage from "@/owner/pages/ObodonlashtirishPage";
import YoshlarPage from "@/owner/pages/YoshlarPage";

const OwnerRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="soliq" element={<SoliqPage />} />
    <Route path="soliq/gaz" element={<SoliqGazPage />} />
    <Route path="soliq/suv" element={<SoliqSuvPage />} />
    <Route path="soliq/elektr" element={<SoliqElektrPage />} />
    <Route path="soliq/yer" element={<SoliqYerPage />} />
    <Route path="obodonlashtirish" element={<ObodonlashtirishPage />} />
    <Route path="yoshlar" element={<YoshlarPage />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
