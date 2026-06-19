import { z } from "zod";
import { SUBSCRIBER_TYPE_VALUES } from "../svet.constants.js";

const filterShape = {
  region: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(SUBSCRIBER_TYPE_VALUES).optional(),
};

export const summarySchema = z.object({ query: z.object(filterShape) });

export const timeseriesSchema = z.object({
  query: z.object({
    ...filterShape,
    metric: z.enum(["usage", "norm", "revenue"]).optional(),
  }),
});

export const breakdownSchema = z.object({
  query: z.object({
    ...filterShape,
    by: z
      .enum(["region", "type", "method", "violationType", "status"])
      .optional(),
  }),
});
