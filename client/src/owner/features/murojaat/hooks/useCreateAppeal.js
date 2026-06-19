import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { murojaatAPI } from "../api/murojaat.api";

export const useCreateAppeal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => murojaatAPI.createAppeal(body).then((r) => r.data.data),
    onSuccess: (appeal) => {
      qc.invalidateQueries({ queryKey: qk.murojaat.myAppeals() });
      toast.success(`Murojaat yuborildi. Raqam: ${appeal.appealNumber}`);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Murojaat yuborilmadi");
    },
  });
};
