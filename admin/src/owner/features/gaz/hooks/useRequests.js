import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

export const useRequests = (params) =>
  useQuery({
    queryKey: qk.gaz.requests(params),
    queryFn: () =>
      gazAPI.listRequests(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });

export const useRequest = (id) =>
  useQuery({
    queryKey: qk.gaz.request(id),
    queryFn: () => gazAPI.getRequest(id).then((r) => r.data.data),
    enabled: !!id,
  });
