import { z } from "zod";
import {
  VIOLATION_TYPE_VALUES,
  VIOLATION_STATUS_VALUES,
} from "../svet.constants.js";

export const listViolationsSchema = z.object({
  query: z.object({
    region: z.string().optional(),
    type: z.enum(VIOLATION_TYPE_VALUES).optional(),
    status: z.enum(VIOLATION_STATUS_VALUES).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(500).optional(),
  }),
});
