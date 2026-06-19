import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { yerAPI } from "../api/yer.api";

export const useYerSummary = (params) =>
  useQuery({
    queryKey: qk.yer.analytics("summary", params),
    queryFn: () => yerAPI.analyticsSummary(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

export const useYerTimeseries = (params) =>
  useQuery({
    queryKey: qk.yer.analytics("timeseries", params),
    queryFn: () => yerAPI.analyticsTimeseries(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

export const useYerBreakdown = (by, params) =>
  useQuery({
    queryKey: qk.yer.analytics(`breakdown:${by}`, params),
    queryFn: () =>
      yerAPI.analyticsBreakdown({ ...params, by }).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });
