import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { soliqAPI } from "../api/soliq.api";

const unwrap = (r) => r.data.data;
const unwrapWithMeta = (r) => ({ items: r.data.data, meta: r.data.meta });

export const useTaxpayersQuery = (params) =>
  useQuery({
    queryKey: qk.soliq.taxpayers(params),
    queryFn: () => soliqAPI.listTaxpayers(params).then(unwrapWithMeta),
    keepPreviousData: true,
  });

export const useTaxpayerQuery = (id) =>
  useQuery({
    queryKey: qk.soliq.taxpayer(id),
    queryFn: () => soliqAPI.getTaxpayer(id).then(unwrap),
    enabled: !!id,
  });

export const useAssessmentsQuery = (params) =>
  useQuery({
    queryKey: qk.soliq.assessments(params),
    queryFn: () => soliqAPI.listAssessments(params).then(unwrapWithMeta),
    keepPreviousData: true,
  });

export const useDebtorsQuery = (params) =>
  useQuery({
    queryKey: qk.soliq.debtors(params),
    queryFn: () => soliqAPI.listDebtors(params).then(unwrapWithMeta),
    keepPreviousData: true,
  });

export const useSummaryQuery = (params) =>
  useQuery({
    queryKey: qk.soliq.summary(params),
    queryFn: () => soliqAPI.summary(params).then(unwrap),
  });

export const useTimeseriesQuery = (params) =>
  useQuery({
    queryKey: qk.soliq.timeseries(params),
    queryFn: () => soliqAPI.timeseries(params).then(unwrap),
  });

export const useBreakdownQuery = (params) =>
  useQuery({
    queryKey: qk.soliq.breakdown(params),
    queryFn: () => soliqAPI.breakdown(params).then(unwrap),
  });

// Hudud darajasi (region/district/settlement) bo'yicha keyingi darajani oladi.
export const useLocationsQuery = (params) =>
  useQuery({
    queryKey: qk.soliq.locations(params),
    queryFn: () => soliqAPI.locations(params).then(unwrap),
  });

export const useMahallaOverviewQuery = (mahalla) =>
  useQuery({
    queryKey: qk.soliq.mahalla({ mahalla }),
    queryFn: () => soliqAPI.mahalla({ mahalla }).then(unwrap),
    enabled: !!mahalla,
  });
