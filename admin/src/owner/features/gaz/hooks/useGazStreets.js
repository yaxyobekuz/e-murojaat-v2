import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

export const useGazStreets = (params) =>
  useQuery({
    queryKey: qk.gaz.streets(params),
    queryFn: () => gazAPI.streets(params),
    placeholderData: (prev) => prev,
  });
