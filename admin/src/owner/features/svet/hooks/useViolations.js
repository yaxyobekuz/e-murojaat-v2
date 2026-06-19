import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { svetAPI } from "../api/svet.api";

export const useViolations = (params) =>
  useQuery({
    queryKey: qk.svet.violations(params),
    queryFn: () =>
      svetAPI.listViolations(params).then((r) => ({
        items: r.data.data,
        meta: r.data.meta,
      })),
    placeholderData: (prev) => prev,
  });
