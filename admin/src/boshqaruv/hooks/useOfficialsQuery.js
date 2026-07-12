import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { officialsAPI } from "../api/officials.api";

// mahalla yettiligining barcha kiritilgan a'zolari
export const useOfficialsQuery = () =>
  useQuery({
    queryKey: qk.officials.all(),
    queryFn: () => officialsAPI.list().then((r) => r.data.data),
    retry: false,
  });
