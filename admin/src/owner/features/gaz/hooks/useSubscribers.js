import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

export const useSubscribers = (params) =>
  useQuery({
    queryKey: qk.gaz.subscribers(params),
    queryFn: () =>
      gazAPI.listSubscribers(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });

export const useSubscriber = (id) =>
  useQuery({
    queryKey: qk.gaz.subscriber(id),
    queryFn: () => gazAPI.getSubscriber(id).then((r) => r.data.data),
    enabled: !!id,
  });
