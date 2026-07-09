import { useMutation, useQueryClient } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { housesAPI } from "../api/houses.api";

export const useHouseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ osmId, body }) => housesAPI.upsert(osmId, body).then((r) => r.data.data),
    onSuccess: (data, { osmId }) => {
      queryClient.setQueryData(qk.houses.one(osmId), data);
      queryClient.invalidateQueries({ queryKey: qk.houses.all() });
    },
  });
};
