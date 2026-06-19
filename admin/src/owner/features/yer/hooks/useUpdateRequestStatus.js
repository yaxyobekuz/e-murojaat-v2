import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { yerAPI } from "../api/yer.api";

export const useUpdateRequestStatus = (id) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => yerAPI.updateRequestStatus(id, body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.yer.request(id) });
      qc.invalidateQueries({ queryKey: qk.yer.all() });
      toast.success("Holat yangilandi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    },
  });
};
