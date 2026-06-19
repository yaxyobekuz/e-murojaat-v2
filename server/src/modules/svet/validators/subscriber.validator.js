import { z } from "zod";
import {
  SUBSCRIBER_TYPE_VALUES,
  SUBSCRIBER_STATUS_VALUES,
} from "../svet.constants.js";

export const listSubscribersSchema = z.object({
  query: z.object({
    region: z.string().optional(),
    type: z.enum(SUBSCRIBER_TYPE_VALUES).optional(),
    status: z.enum(SUBSCRIBER_STATUS_VALUES).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(500).optional(),
  }),
});

export const idSchema = z.object({
  params: z.object({ id: z.string().length(24, "ID noto'g'ri") }),
});

export const updateSubscriberSchema = z.object({
  params: z.object({ id: z.string().length(24, "ID noto'g'ri") }),
  body: z.object({
    fullName: z.string().min(1).optional(),
    region: z.string().min(1).optional(),
    district: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    type: z.enum(SUBSCRIBER_TYPE_VALUES).optional(),
    socialNormKwh: z.coerce.number().min(0).optional(),
    balanceUzs: z.coerce.number().optional(),
    debtUzs: z.coerce.number().min(0).optional(),
    status: z.enum(SUBSCRIBER_STATUS_VALUES).optional(),
  }),
});

export const checkAccountSchema = z.object({
  query: z.object({ accountNumber: z.string().min(3, "Hisob raqami kerak") }),
});
