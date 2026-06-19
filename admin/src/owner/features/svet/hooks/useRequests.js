import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { svetAPI } from "../api/svet.api";

export const useRequests = (params) =>
  useQuery({
    queryKey: qk.svet.requests(params),
    queryFn: () =>
      svetAPI.listRequests(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });

export const useRequest = (id) =>
  useQuery({
    queryKey: qk.svet.request(id),
    queryFn: () => svetAPI.getRequest(id).then((r) => r.data.data),
    enabled: !!id,
  });
