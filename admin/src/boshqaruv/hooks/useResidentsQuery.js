import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { residentsAPI } from "../api/residents.api";

// server'ga kiritilgan barcha fuqarolar ro'yxati
export const useResidentsQuery = () =>
  useQuery({
    queryKey: qk.residents.all(),
    queryFn: () => residentsAPI.list().then((r) => r.data.data),
    retry: false,
  });
