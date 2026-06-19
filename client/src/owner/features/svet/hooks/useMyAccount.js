import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { svetAPI } from "../api/svet.api";

export const useMyAccount = () =>
  useQuery({
    queryKey: qk.svet.myAccount(),
    queryFn: () => svetAPI.myAccount().then((r) => r.data.data),
  });
