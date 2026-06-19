import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { murojaatAPI } from "../api/murojaat.api";

export const useUpdateAppeal = (id) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => murojaatAPI.updateAppeal(id, body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.murojaat.appeal(id) });
      qc.invalidateQueries({ queryKey: qk.murojaat.all() });
      toast.success("Murojaat yangilandi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    },
  });
};
