import { useMutation } from "@tanstack/react-query";
import { yerAPI } from "../api/yer.api";

// Mutation-style: triggered on submit, not on mount
export const useCheckRegistry = () =>
  useMutation({
    mutationFn: (cadastreNumber) =>
      yerAPI.checkRegistry(cadastreNumber).then((r) => r.data.data),
  });
