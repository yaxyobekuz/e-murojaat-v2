import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { yerAPI } from "../api/yer.api";

// kind: summary | timeseries | landUse | monthlyRegistrations |
//       cadasterCompleteness | breakdown:<dim>
export const useYerAnalytics = (kind, params) =>
  useQuery({
    queryKey: qk.yer.analytics(kind, params),
    queryFn: () => yerAPI.analytics(kind, params),
    placeholderData: (prev) => prev,
  });
