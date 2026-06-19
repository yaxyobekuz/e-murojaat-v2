import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

export const useGazSummary = (params) =>
  useQuery({
    queryKey: qk.gaz.analytics("summary", params),
    queryFn: () => gazAPI.analyticsSummary(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

export const useGazTimeseries = (params) =>
  useQuery({
    queryKey: qk.gaz.analytics("timeseries", params),
    queryFn: () => gazAPI.analyticsTimeseries(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

export const useGazBreakdown = (by, params) =>
  useQuery({
    queryKey: qk.gaz.analytics(`breakdown:${by}`, params),
    queryFn: () =>
      gazAPI.analyticsBreakdown({ ...params, by }).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });
