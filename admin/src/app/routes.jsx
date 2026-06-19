// Router
import { Routes as RoutesWrapper, Route, Navigate } from "react-router-dom";

// Guards
import AuthGuard from "@/shared/components/guards/AuthGuard";
import GuestGuard from "@/shared/components/guards/GuestGuard";
import RoleGuard from "@/shared/components/guards/RoleGuard";

// Layouts
import AuthLayout from "@/features/auth/layouts/AuthLayout";
import DashboardLayout from "@/shared/layouts/DashboardLayout";

// Hooks
import useAuth from "@/shared/hooks/useAuth";

// Constants
import { ROLES, ROLE_HOME } from "@/shared/constants/roles";

// Features
import { LoginPage } from "@/features/auth";

// Role panels
import { OwnerRoutes } from "@/owner";

const RoleHomeRedirect = () => {
  const { role } = useAuth();
  return <Navigate to={ROLE_HOME[role] || "/login"} replace />;
};

const Routes = () => (
  <RoutesWrapper>
    <Route element={<GuestGuard />}>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Route>

    <Route element={<AuthGuard />}>
      <Route element={<DashboardLayout />}>
        <Route
          path="/owner/*"
          element={
            <RoleGuard roles={ROLES.OWNER}>
              <OwnerRoutes />
            </RoleGuard>
          }
        />

        <Route path="/" element={<RoleHomeRedirect />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </RoutesWrapper>
);

export default Routes;
