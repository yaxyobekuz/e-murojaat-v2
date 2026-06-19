import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { svetAPI } from "../api/svet.api";

export const useCreatePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => svetAPI.createPayment(body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.svet.myAccount() });
      toast.success("To'lov amalga oshirildi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "To'lov amalga oshmadi");
    },
  });
};
