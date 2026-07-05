// Kameralar uchun TanStack Query hooklari.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cameraApi } from "@/shared/lib/cameraApi";

export const useCamerasQuery = () =>
  useQuery({ queryKey: ["cameras", "list"], queryFn: () => cameraApi.list(), retry: false, refetchInterval: 30000 });

export const useCameraStatus = (id) =>
  useQuery({ queryKey: ["cameras", "status", id], queryFn: () => cameraApi.status(id), enabled: !!id, retry: false, refetchInterval: 15000 });

const invalidateAll = (qc) => {
  qc.invalidateQueries({ queryKey: ["cameras"] });
  qc.invalidateQueries({ queryKey: ["live-cameras"] }); // Markaz/FVV ham yangilansin
};

export const useAddCamera = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body) => cameraApi.create(body), onSuccess: () => invalidateAll(qc) });
};

export const useRemoveCamera = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => cameraApi.remove(id), onSuccess: () => invalidateAll(qc) });
};
