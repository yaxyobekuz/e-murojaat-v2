import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { yerAPI } from "../api/yer.api";

export const useRequests = (params) =>
  useQuery({
    queryKey: qk.yer.requests(params),
    queryFn: () =>
      yerAPI.listRequests(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });

export const useRequest = (id) =>
  useQuery({
    queryKey: qk.yer.request(id),
    queryFn: () => yerAPI.getRequest(id).then((r) => r.data.data),
    enabled: !!id,
  });
