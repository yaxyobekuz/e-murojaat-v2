import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { svetAPI } from "../api/svet.api";

export const useMyRequests = () =>
  useQuery({
    queryKey: qk.svet.myRequests(),
    queryFn: () => svetAPI.myRequests().then((r) => r.data.data),
  });
