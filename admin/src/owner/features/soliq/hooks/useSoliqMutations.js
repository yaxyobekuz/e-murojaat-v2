import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { soliqAPI } from "../api/soliq.api";

export const usePayMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => soliqAPI.pay(id, body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.soliq.all() });
      toast.success("To'lov qabul qilindi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "To'lovda xato");
    },
  });
};

export const useCreateTaxpayerMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => soliqAPI.createTaxpayer(body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.soliq.all() });
      toast.success("Soliq to'lovchi qo'shildi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Qo'shishda xato");
    },
  });
};
