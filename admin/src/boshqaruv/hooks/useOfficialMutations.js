import { useMutation, useQueryClient } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { officialsAPI } from "../api/officials.api";

export const useOfficialSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ role, body }) => officialsAPI.upsert(role, body).then((r) => r.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.officials.all() }),
  });
};

export const useOfficialDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (role) => officialsAPI.remove(role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.officials.all() }),
  });
};
