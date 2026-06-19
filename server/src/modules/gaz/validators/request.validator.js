import { z } from "zod";
import { SERVICE_TYPE_VALUES, REQUEST_STATUS_VALUES } from "../gaz.constants.js";

export const listRequestsSchema = z.object({
  query: z.object({
    status: z.enum(REQUEST_STATUS_VALUES).optional(),
    serviceType: z.enum(SERVICE_TYPE_VALUES).optional(),
    region: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(500).optional(),
  }),
});

export const idSchema = z.object({
  params: z.object({ id: z.string().length(24, "ID noto'g'ri") }),
});

export const createRequestSchema = z.object({
  body: z.object({
    serviceType: z.enum(SERVICE_TYPE_VALUES),
    subscriberId: z.string().length(24).optional(),
    region: z.string().optional(),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({ id: z.string().length(24, "ID noto'g'ri") }),
  body: z
    .object({
      status: z.enum(REQUEST_STATUS_VALUES).optional(),
      comment: z.string().optional(),
      operatorNote: z.string().optional(),
    })
    .refine((b) => Object.keys(b).length > 0, {
      message: "Hech bo'lmaganda bitta maydon kerak",
    }),
});

export const createPaymentSchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive("To'lov summasi noto'g'ri"),
    method: z.enum(["click", "payme", "uzcard", "bank"]).optional(),
  }),
});
