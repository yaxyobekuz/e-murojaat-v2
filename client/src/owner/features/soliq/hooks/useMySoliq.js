import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { soliqAPI } from "../api/soliq.api";

// Demo: tizimdagi demo (isDemo) to'lovchini topib, uning kartochkasini ko'rsatamiz.
export const useMyTaxpayerQuery = () =>
  useQuery({
    queryKey: qk.soliq.taxpayers({ demo: true }),
    queryFn: async () => {
      const list = await soliqAPI.listTaxpayers({ search: "301234567", limit: 1 });
      const me = list.data.data?.[0];
      if (!me) return null;
      const detail = await soliqAPI.getTaxpayer(me._id);
      return detail.data.data;
    },
  });

export const usePayMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => soliqAPI.pay(id, body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.soliq.all() });
      toast.success("To'lov muvaffaqiyatli amalga oshirildi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "To'lovda xato");
    },
  });
};
