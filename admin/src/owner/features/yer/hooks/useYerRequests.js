import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { yerAPI } from "../api/yer.api";

export const useYerRequests = (params) =>
  useQuery({
    queryKey: qk.yer.requests(params),
    queryFn: () => yerAPI.requests(params),
    placeholderData: (prev) => prev,
  });
