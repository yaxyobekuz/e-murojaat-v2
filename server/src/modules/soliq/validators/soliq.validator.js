import { z } from "zod";
import { TAX_TYPES, ASSESSMENT_STATUSES } from "../../../models/taxAssessment.model.js";
import { PAYMENT_METHODS } from "../../../models/taxPayment.model.js";

const pageQuery = {
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
};

// Hudud filtri (4 daraja) — barcha ro'yxat va analitika so'rovlarida bir xil.
const locationQuery = {
  region: z.string().optional(),
  district: z.string().optional(),
  settlement: z.string().optional(),
  mahalla: z.string().optional(),
};

export const idSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const listTaxpayersSchema = z.object({
  query: z.object({
    ...locationQuery,
    type: z.enum(["jismoniy", "yatt", "yuridik"]).optional(),
    search: z.string().optional(),
    ...pageQuery,
  }),
});

export const createTaxpayerSchema = z.object({
  body: z.object({
    stir: z.string().min(9).max(9),
    jshshir: z.string().min(14).max(14).optional(),
    type: z.enum(["jismoniy", "yatt", "yuridik"]).default("jismoniy"),
    fullName: z.string().min(2).max(120),
    region: z.string().min(1),
    district: z.string().optional(),
    settlement: z.string().optional(),
    mahalla: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
  }),
});

export const updateTaxpayerSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      fullName: z.string().min(2).max(120).optional(),
      region: z.string().min(1).optional(),
      district: z.string().optional(),
      settlement: z.string().optional(),
      mahalla: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      status: z.enum(["aktiv", "nofaol"]).optional(),
    })
    .refine((b) => Object.keys(b).length > 0, { message: "Hech bo'lmaganda bitta maydon kerak" }),
});

export const listAssessmentsSchema = z.object({
  query: z.object({
    ...locationQuery,
    taxType: z.enum(TAX_TYPES).optional(),
    status: z.enum(ASSESSMENT_STATUSES).optional(),
    year: z.coerce.number().int().optional(),
    ...pageQuery,
  }),
});

export const listDebtorsSchema = z.object({
  query: z.object({ ...locationQuery, ...pageQuery }),
});

export const paySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    amount_uzs: z.coerce.number().positive(),
    method: z.enum(PAYMENT_METHODS).default("click"),
  }),
});

export const analyticsSchema = z.object({
  query: z.object({
    ...locationQuery,
    months: z.coerce.number().int().min(1).max(36).optional(),
    by: z.enum(["region", "type", "taxType", "method", "status"]).optional(),
  }),
});

export const mahallaOverviewSchema = z.object({
  query: z.object({ mahalla: z.string().min(1) }),
});
