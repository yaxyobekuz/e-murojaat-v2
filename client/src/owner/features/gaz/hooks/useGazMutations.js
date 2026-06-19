import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

export const useCreatePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => gazAPI.createPayment(body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.gaz.myAccount() });
      qc.invalidateQueries({ queryKey: qk.gaz.myPayments() });
      toast.success("To'lov amalga oshirildi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "To'lov amalga oshmadi");
    },
  });
};

export const useCreateRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => gazAPI.createRequest(body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.gaz.myRequests() });
      toast.success("Ariza yuborildi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Ariza yuborilmadi");
    },
  });
};

export const useCheckRegistry = () =>
  useMutation({
    mutationFn: (accountNumber) =>
      gazAPI.checkRegistry(accountNumber).then((r) => r.data.data),
  });
