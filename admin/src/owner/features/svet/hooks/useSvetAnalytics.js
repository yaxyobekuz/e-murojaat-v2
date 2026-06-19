import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { svetAPI } from "../api/svet.api";

export const useSvetSummary = (params) =>
  useQuery({
    queryKey: qk.svet.analytics("summary", params),
    queryFn: () => svetAPI.analyticsSummary(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

export const useSvetTimeseries = (metric, params) =>
  useQuery({
    queryKey: qk.svet.analytics(`timeseries:${metric}`, params),
    queryFn: () =>
      svetAPI.analyticsTimeseries({ ...params, metric }).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

export const useSvetBreakdown = (by, params) =>
  useQuery({
    queryKey: qk.svet.analytics(`breakdown:${by}`, params),
    queryFn: () =>
      svetAPI.analyticsBreakdown({ ...params, by }).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });
