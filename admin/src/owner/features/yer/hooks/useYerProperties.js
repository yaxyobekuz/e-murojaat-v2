import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { yerAPI } from "../api/yer.api";

export const useYerProperties = (params) =>
  useQuery({
    queryKey: qk.yer.properties(params),
    queryFn: () => yerAPI.properties(params),
    placeholderData: (prev) => prev,
  });
