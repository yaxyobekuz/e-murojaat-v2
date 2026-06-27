import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { suyuqGazAPI } from "../api/suyuqGaz.api";

// kind: summary | deliveryTrend | sources | fulfillmentByStreet | debtByStreet | streetRows
export const useSuyuqGazAnalytics = (kind, params) =>
  useQuery({
    queryKey: qk.suyuqGaz.analytics(kind, params),
    queryFn: () => suyuqGazAPI.analytics(kind, params),
    placeholderData: (prev) => prev,
  });
