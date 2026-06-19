import { z } from "zod";
import {
  SERVICE_TYPE_VALUES,
  PROPERTY_TYPE_VALUES,
} from "../yer.constants.js";

const filterShape = {
  region: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(PROPERTY_TYPE_VALUES).optional(),
  serviceType: z.enum(SERVICE_TYPE_VALUES).optional(),
};

export const summarySchema = z.object({ query: z.object(filterShape) });

export const timeseriesSchema = z.object({ query: z.object(filterShape) });

export const breakdownSchema = z.object({
  query: z.object({
    ...filterShape,
    by: z.enum(["region", "type", "status", "serviceType"]).optional(),
  }),
});

export const checkRegistrySchema = z.object({
  query: z.object({ cadastreNumber: z.string().min(3, "Kadastr raqami kerak") }),
});
