import { useMutation, useQueryClient } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { residentsAPI } from "../api/residents.api";

// id bo'lsa — yangilash, bo'lmasa — yangi fuqaro qo'shish
export const useResidentSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) =>
      (id ? residentsAPI.update(id, body) : residentsAPI.create(body)).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.residents.all() });
      queryClient.invalidateQueries({ queryKey: qk.mahalla.indicators() });
    },
  });
};

export const useResidentDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => residentsAPI.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.residents.all() });
      queryClient.invalidateQueries({ queryKey: qk.mahalla.indicators() });
    },
  });
};
