import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { murojaatAPI } from "../api/murojaat.api";

export const useAppeals = (params) =>
  useQuery({
    queryKey: qk.murojaat.appeals(params),
    queryFn: () =>
      murojaatAPI.listAppeals(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });

export const useAppeal = (id) =>
  useQuery({
    queryKey: qk.murojaat.appeal(id),
    queryFn: () => murojaatAPI.getAppeal(id).then((r) => r.data.data),
    enabled: !!id,
  });
