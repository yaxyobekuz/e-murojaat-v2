import { z } from "zod";
import {
  PROPERTY_TYPE_VALUES,
  OWNERSHIP_TYPE_VALUES,
  PROPERTY_STATUS_VALUES,
} from "../yer.constants.js";

export const listPropertiesSchema = z.object({
  query: z.object({
    region: z.string().optional(),
    district: z.string().optional(),
    type: z.enum(PROPERTY_TYPE_VALUES).optional(),
    status: z.enum(PROPERTY_STATUS_VALUES).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(500).optional(),
  }),
});

export const idSchema = z.object({
  params: z.object({ id: z.string().length(24, "ID noto'g'ri") }),
});

export const createPropertySchema = z.object({
  body: z.object({
    cadastreNumber: z.string().min(3),
    type: z.enum(PROPERTY_TYPE_VALUES),
    region: z.string().min(1),
    district: z.string().min(1),
    address: z.string().min(1),
    areaM2: z.coerce.number().min(0),
    valueUzs: z.coerce.number().min(0),
    ownershipType: z.enum(OWNERSHIP_TYPE_VALUES),
    ownerJshshir: z.string().optional(),
    status: z.enum(PROPERTY_STATUS_VALUES).optional(),
  }),
});

export const updatePropertySchema = z.object({
  params: z.object({ id: z.string().length(24, "ID noto'g'ri") }),
  body: z.object({
    type: z.enum(PROPERTY_TYPE_VALUES).optional(),
    region: z.string().min(1).optional(),
    district: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    areaM2: z.coerce.number().min(0).optional(),
    valueUzs: z.coerce.number().min(0).optional(),
    ownershipType: z.enum(OWNERSHIP_TYPE_VALUES).optional(),
    ownerJshshir: z.string().optional(),
    status: z.enum(PROPERTY_STATUS_VALUES).optional(),
  }),
});
