import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { murojaatAPI } from "../api/murojaat.api";

export const useOrganizations = () =>
  useQuery({
    queryKey: qk.murojaat.organizations(),
    queryFn: () => murojaatAPI.listOrganizations().then((r) => r.data.data),
  });

export const useCreateOrganization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => murojaatAPI.createOrganization(body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.murojaat.organizations() });
      toast.success("Tashkilot qo'shildi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Tashkilot qo'shilmadi");
    },
  });
};
