import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { yerAPI } from "../api/yer.api";

export const useMyProperties = () =>
  useQuery({
    queryKey: qk.yer.myProperties(),
    queryFn: () => yerAPI.myProperties().then((r) => r.data.data),
  });

export const useProperty = (id) =>
  useQuery({
    queryKey: qk.yer.property(id),
    queryFn: () => yerAPI.getProperty(id).then((r) => r.data.data),
    enabled: !!id,
  });
