import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

export const useUpdateRequestStatus = (id) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => gazAPI.updateRequestStatus(id, body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.gaz.request(id) });
      qc.invalidateQueries({ queryKey: qk.gaz.all() });
      toast.success("Holat yangilandi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    },
  });
};
