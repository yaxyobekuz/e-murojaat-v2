import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { murojaatAPI } from "../api/murojaat.api";

// Lookup by tracking number on demand (button press)
export const useTrackAppeal = () =>
  useMutation({
    mutationFn: (appealNumber) =>
      murojaatAPI.track(appealNumber).then((r) => r.data.data),
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Murojaat topilmadi");
    },
  });
