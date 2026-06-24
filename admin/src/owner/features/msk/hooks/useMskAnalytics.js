import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { mskAPI } from "../api/msk.api";

// kind: summary | timeseries | byCategory | byStatus | byGender | workerGender |
//       byAge | ageCategory | durationHist | durationByCategory | sla | workers |
//       byStreet | bySource | byPriority | satisfaction | seasonal
export const useMskAnalytics = (kind, filter) =>
  useQuery({
    queryKey: qk.msk.analytics(kind, filter),
    queryFn: () => mskAPI.analytics(kind, filter),
    placeholderData: (prev) => prev,
  });
