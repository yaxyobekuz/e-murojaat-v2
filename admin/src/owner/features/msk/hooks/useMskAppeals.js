import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { mskAPI } from "../api/msk.api";

export const useMskAppeals = (params) =>
  useQuery({
    queryKey: qk.msk.appeals(params),
    queryFn: () => mskAPI.appeals(params),
    placeholderData: (prev) => prev,
  });
