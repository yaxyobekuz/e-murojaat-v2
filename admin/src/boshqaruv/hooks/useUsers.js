import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { usersAPI } from "../api/users.api";

export const useUsersQuery = () =>
  useQuery({
    queryKey: qk.users.all(),
    queryFn: () => usersAPI.list().then((r) => r.data.data),
    retry: false,
  });

// id bo'lsa — yangilash, bo'lmasa — yaratish
export const useUserSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => (id ? usersAPI.update(id, body) : usersAPI.create(body)).then((r) => r.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.users.all() }),
  });
};

export const useUserDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersAPI.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.users.all() }),
  });
};
