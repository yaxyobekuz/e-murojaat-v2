import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { svetAPI } from "../api/svet.api";

export const useCreateRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => svetAPI.createRequest(body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.svet.myRequests() });
      toast.success("Ariza yuborildi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Ariza yuborilmadi");
    },
  });
};
