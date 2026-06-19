import { z } from "zod";
import { APPEAL_TYPE_VALUES, CATEGORY_VALUES } from "../murojaat.constants.js";

const filterShape = {
  region: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(APPEAL_TYPE_VALUES).optional(),
  category: z.enum(CATEGORY_VALUES).optional(),
};

export const summarySchema = z.object({ query: z.object(filterShape) });

export const timeseriesSchema = z.object({ query: z.object(filterShape) });

export const breakdownSchema = z.object({
  query: z.object({
    ...filterShape,
    by: z
      .enum(["region", "type", "category", "status", "result", "organization"])
      .optional(),
  }),
});
