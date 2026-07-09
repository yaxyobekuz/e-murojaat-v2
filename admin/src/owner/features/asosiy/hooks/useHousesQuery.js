import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { housesAPI } from "../api/houses.api";

// server'ga kiritilgan barcha xonadonlar (reyestr + editor xaritasida belgilash uchun)
export const useHousesQuery = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: qk.houses.all(),
    queryFn: () => housesAPI.list().then((r) => r.data.data),
    enabled,
    retry: false, // server o'chiq bo'lsa xarita oddiy rejimda ishlayveradi
  });
