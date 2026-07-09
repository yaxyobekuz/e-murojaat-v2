import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { housesAPI } from "../api/houses.api";

// osmId bo'yicha server'dagi xonadon ma'lumoti (kiritilmagan bo'lsa null)
export const useHouseQuery = (osmId) =>
  useQuery({
    queryKey: qk.houses.one(osmId),
    queryFn: () => housesAPI.one(osmId).then((r) => r.data.data),
    enabled: Boolean(osmId),
    retry: false, // server o'chiq bo'lsa panel mock rejimda ishlayveradi
  });
