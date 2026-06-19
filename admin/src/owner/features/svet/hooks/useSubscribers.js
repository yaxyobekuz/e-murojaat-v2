import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { svetAPI } from "../api/svet.api";

export const useSubscribers = (params) =>
  useQuery({
    queryKey: qk.svet.subscribers(params),
    queryFn: () =>
      svetAPI.listSubscribers(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });

export const useSubscriber = (id) =>
  useQuery({
    queryKey: qk.svet.subscriber(id),
    queryFn: () => svetAPI.getSubscriber(id).then((r) => r.data.data),
    enabled: !!id,
  });
