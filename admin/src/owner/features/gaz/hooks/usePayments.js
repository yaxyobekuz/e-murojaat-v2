import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

export const usePayments = (params) =>
  useQuery({
    queryKey: qk.gaz.payments(params),
    queryFn: () =>
      gazAPI.listPayments(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });

export const useDebtors = (params) =>
  useQuery({
    queryKey: qk.gaz.debtors(params),
    queryFn: () =>
      gazAPI.listDebtors(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });
