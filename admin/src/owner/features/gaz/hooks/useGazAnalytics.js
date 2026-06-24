import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

// kind: summary | heatmap | byStatus | bySupplyType | adequacy | cylindersByStreet |
//       cycleByStreet | perFamily | deliveryTrend | incidentsTrend | repair | suppliers
export const useGazAnalytics = (kind, filter) =>
  useQuery({
    queryKey: qk.gaz.analytics(kind, filter),
    queryFn: () => gazAPI.analytics(kind, filter),
    placeholderData: (prev) => prev,
  });
