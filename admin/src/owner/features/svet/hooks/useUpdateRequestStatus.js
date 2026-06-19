import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { svetAPI } from "../api/svet.api";

export const useUpdateRequestStatus = (id) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => svetAPI.updateRequestStatus(id, body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.svet.request(id) });
      qc.invalidateQueries({ queryKey: qk.svet.all() });
      toast.success("Holat yangilandi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    },
  });
};
