import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { yerAPI } from "../api/yer.api";

export const useMyRequests = () =>
  useQuery({
    queryKey: qk.yer.myRequests(),
    queryFn: () => yerAPI.myRequests().then((r) => r.data.data),
  });
