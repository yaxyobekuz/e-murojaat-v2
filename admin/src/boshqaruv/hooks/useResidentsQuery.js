import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { residentsAPI } from "../api/residents.api";

// params bo'lsa (masalan {houseOsmId}) — filtrlangan ro'yxat, bo'lmasa — hammasi
export const useResidentsQuery = (params) =>
  useQuery({
    queryKey: params ? qk.residents.list(params) : qk.residents.all(),
    queryFn: () => residentsAPI.list(params).then((r) => r.data.data),
    retry: false,
  });
