import { z } from "zod";
import {
  APPEAL_TYPE_VALUES,
  CATEGORY_VALUES,
  APPEAL_STATUS_VALUES,
  APPEAL_RESULT_VALUES,
} from "../murojaat.constants.js";

export const listAppealsSchema = z.object({
  query: z.object({
    type: z.enum(APPEAL_TYPE_VALUES).optional(),
    category: z.enum(CATEGORY_VALUES).optional(),
    status: z.enum(APPEAL_STATUS_VALUES).optional(),
    region: z.string().optional(),
    organizationId: z.string().length(24).optional(),
    overdue: z.enum(["true", "false"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(500).optional(),
  }),
});

export const idSchema = z.object({
  params: z.object({ id: z.string().length(24, "ID noto'g'ri") }),
});

export const createAppealSchema = z.object({
  body: z.object({
    type: z.enum(APPEAL_TYPE_VALUES),
    category: z.enum(CATEGORY_VALUES),
    organizationId: z.string().length(24).optional(),
    region: z.string().optional(),
    district: z.string().optional(),
    subject: z.string().min(3, "Mavzu kerak").max(200),
    body: z.string().min(5, "Murojaat matni kerak"),
  }),
});

export const updateAppealSchema = z.object({
  params: z.object({ id: z.string().length(24, "ID noto'g'ri") }),
  body: z
    .object({
      status: z.enum(APPEAL_STATUS_VALUES).optional(),
      comment: z.string().optional(),
      organizationId: z.string().length(24).nullable().optional(),
      reply: z.string().optional(),
      result: z.enum(APPEAL_RESULT_VALUES).nullable().optional(),
      operatorNote: z.string().optional(),
    })
    .refine((b) => Object.keys(b).length > 0, {
      message: "Hech bo'lmaganda bitta maydon kerak",
    }),
});

export const trackSchema = z.object({
  query: z.object({ appealNumber: z.string().min(3, "Murojaat raqami kerak") }),
});
