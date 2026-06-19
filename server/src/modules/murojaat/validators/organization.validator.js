import { z } from "zod";
import { ORGANIZATION_TYPE_VALUES } from "../murojaat.constants.js";

export const createOrganizationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Tashkilot nomi kerak").max(160),
    type: z.enum(ORGANIZATION_TYPE_VALUES),
    region: z.string().optional(),
  }),
});
