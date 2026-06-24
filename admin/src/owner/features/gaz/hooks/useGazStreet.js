import { useQuery } from "@tanstack/react-query";

import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

export const useGazStreet = (id) =>
  useQuery({
    queryKey: qk.gaz.street(id),
    queryFn: () => gazAPI.street(id),
    enabled: !!id,
  });
