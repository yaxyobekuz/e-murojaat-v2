// Router
import { Routes as RoutesWrapper, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "@/shared/layouts/DashboardLayout";

// Role panels
import { OwnerRoutes } from "@/owner";

const Routes = () => (
  <RoutesWrapper>
    <Route element={<DashboardLayout />}>
      <Route path="/owner/*" element={<OwnerRoutes />} />
      <Route path="/" element={<Navigate to="/owner" replace />} />
    </Route>

    <Route path="*" element={<Navigate to="/owner" replace />} />
  </RoutesWrapper>
);

export default Routes;
