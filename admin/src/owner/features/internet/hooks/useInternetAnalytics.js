import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { internetAPI } from "../api/internet.api";

// kind: summary | speedTrend | providers | coverageByStreet | techMix | streetRows
export const useInternetAnalytics = (kind, params) =>
  useQuery({
    queryKey: qk.internet.analytics(kind, params),
    queryFn: () => internetAPI.analytics(kind, params),
    placeholderData: (prev) => prev,
  });
