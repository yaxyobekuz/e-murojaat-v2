import { z } from "zod";
import {
  SUBSCRIBER_TYPE_VALUES,
  SUBSCRIBER_STATUS_VALUES,
} from "../gaz.constants.js";

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

export const listDebtorsSchema = z.object({
  query: z.object({
    region: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(500).optional(),
  }),
});

export const idSchema = z.object({
  params: z.object({ id: z.string().length(24, "ID noto'g'ri") }),
});
