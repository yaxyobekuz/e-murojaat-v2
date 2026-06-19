import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { yerAPI } from "../api/yer.api";

export const useProperties = (params) =>
  useQuery({
    queryKey: qk.yer.properties(params),
    queryFn: () =>
      yerAPI.listProperties(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });

export const useProperty = (id) =>
  useQuery({
    queryKey: qk.yer.property(id),
    queryFn: () => yerAPI.getProperty(id).then((r) => r.data.data),
    enabled: !!id,
  });
