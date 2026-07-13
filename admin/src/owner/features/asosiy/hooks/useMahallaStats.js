import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { statsAPI } from "../api/stats.api";
import { buildStats } from "../data/mergeStats";

// Server indikatorlarini mock ustidan merge qiladi. Server o'chiq bo'lsa — pure mock.
export const useMahallaStats = () => {
  const { data } = useQuery({
    queryKey: qk.mahalla.indicators(),
    queryFn: () => statsAPI.indicators().then((r) => r.data.data),
    retry: false,
    staleTime: 30_000,
  });
  return buildStats(data);
};
