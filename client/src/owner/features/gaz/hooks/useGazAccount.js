import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { gazAPI } from "../api/gaz.api";

export const useMyAccount = () =>
  useQuery({
    queryKey: qk.gaz.myAccount(),
    queryFn: () => gazAPI.myAccount().then((r) => r.data.data),
  });

export const useMyUsage = () =>
  useQuery({
    queryKey: qk.gaz.myUsage(),
    queryFn: () => gazAPI.myUsage().then((r) => r.data.data),
  });

export const useMyPayments = () =>
  useQuery({
    queryKey: qk.gaz.myPayments(),
    queryFn: () => gazAPI.myPayments().then((r) => r.data.data),
  });

export const useMyRequests = () =>
  useQuery({
    queryKey: qk.gaz.myRequests(),
    queryFn: () => gazAPI.myRequests().then((r) => r.data.data),
  });
