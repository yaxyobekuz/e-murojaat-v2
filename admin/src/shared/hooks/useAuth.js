// Constants
import { ROLES } from "@/shared/constants/roles";

// Auth panel olib tashlangan — statik owner sifatida ishlaydi.
const useAuth = () => ({
  user: null,
  role: ROLES.OWNER,
  permissions: [],
  isOwner: true,
  isAuthenticated: true,
  isLoading: false,
  isError: false,
  refetch: () => {},
});

export default useAuth;
