import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { murojaatAPI } from "../api/murojaat.api";

export const useOrganizations = () =>
  useQuery({
    queryKey: qk.murojaat.organizations(),
    queryFn: () => murojaatAPI.listOrganizations().then((r) => r.data.data),
  });
