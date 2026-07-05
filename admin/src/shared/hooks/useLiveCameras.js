// Real (qo'shilgan) kameralar ro'yxatini oluvchi umumiy hook.
// Markaz / FVV / IIB — kamera ko'rsatiladigan hamma joy shu hookdan foydalanadi.
// Backend o'chiq bo'lsa xato beradi (retry: false) — chaqiruvchi demo'ga qaytadi.
import { useQuery } from "@tanstack/react-query";
import { cameraApi } from "@/shared/lib/cameraApi";

export function useLiveCameras(options = {}) {
  return useQuery({
    queryKey: ["live-cameras"],
    queryFn: () => cameraApi.list(),
    staleTime: 15000,
    refetchInterval: 30000,
    retry: false,
    ...options,
  });
}
