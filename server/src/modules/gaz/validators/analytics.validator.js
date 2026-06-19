import { z } from "zod";
import { SUBSCRIBER_TYPE_VALUES } from "../gaz.constants.js";

const filterShape = {
  region: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(SUBSCRIBER_TYPE_VALUES).optional(),
};

export const summarySchema = z.object({ query: z.object(filterShape) });

export const timeseriesSchema = z.object({ query: z.object(filterShape) });

export const breakdownSchema = z.object({
  query: z.object({
    ...filterShape,
    by: z
      .enum(["region", "type", "status", "serviceType", "method", "meterType"])
      .optional(),
  }),
});

export const checkRegistrySchema = z.object({
  query: z.object({
    accountNumber: z.string().min(3, "Shaxsiy hisob raqami kerak"),
  }),
});
