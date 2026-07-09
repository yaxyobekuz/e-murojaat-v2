import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { boshqaruvAuthAPI } from "../api/auth.api";

// joriy owner sessiyasi (401 → login sahifasiga yo'naltiriladi)
export const useBoshqaruvMe = () =>
  useQuery({
    queryKey: qk.boshqaruv.me(),
    queryFn: () => boshqaruvAuthAPI.me().then((r) => r.data.data),
    retry: false,
    staleTime: 60_000,
  });
