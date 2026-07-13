import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { mahallaAPI } from "../api/mahalla.api";

export const useMahallaIndicatorsQuery = () =>
  useQuery({
    queryKey: qk.mahalla.indicators(),
    queryFn: () => mahallaAPI.indicators().then((r) => r.data.data),
    retry: false,
  });

export const useIndicatorSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ domain, body }) => mahallaAPI.patch(domain, body).then((r) => r.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.mahalla.indicators() }),
  });
};
