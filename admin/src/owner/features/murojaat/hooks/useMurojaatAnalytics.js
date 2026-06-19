import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { murojaatAPI } from "../api/murojaat.api";

export const useMurojaatSummary = (params) =>
  useQuery({
    queryKey: qk.murojaat.analytics("summary", params),
    queryFn: () => murojaatAPI.analyticsSummary(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

export const useMurojaatTimeseries = (params) =>
  useQuery({
    queryKey: qk.murojaat.analytics("timeseries", params),
    queryFn: () => murojaatAPI.analyticsTimeseries(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

export const useMurojaatBreakdown = (by, params) =>
  useQuery({
    queryKey: qk.murojaat.analytics(`breakdown:${by}`, params),
    queryFn: () =>
      murojaatAPI.analyticsBreakdown({ ...params, by }).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });
