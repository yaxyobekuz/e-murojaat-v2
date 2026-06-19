import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { murojaatAPI } from "../api/murojaat.api";

export const useMyAppeals = () =>
  useQuery({
    queryKey: qk.murojaat.myAppeals(),
    queryFn: () => murojaatAPI.myAppeals().then((r) => r.data.data),
  });
