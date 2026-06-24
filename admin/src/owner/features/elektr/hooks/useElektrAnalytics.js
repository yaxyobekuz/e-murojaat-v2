import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { elektrAPI } from "../api/elektr.api";

// kind: summary | timeseries | energyBalance | lossesWaterfall | mttr | health |
//       voltage | askue | solar | breakdownType | reliability
export const useElektrAnalytics = (kind, params) =>
  useQuery({
    queryKey: qk.elektr.analytics(kind, params),
    queryFn: () => elektrAPI.analytics(kind, params),
    placeholderData: (prev) => prev,
  });
