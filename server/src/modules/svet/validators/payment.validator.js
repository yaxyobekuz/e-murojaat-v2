import { z } from "zod";
import { PAYMENT_METHOD_VALUES } from "../svet.constants.js";

export const createPaymentSchema = z.object({
  body: z.object({
    amountUzs: z.coerce.number().min(1000, "Minimal summa 1 000 so'm"),
    method: z.enum(PAYMENT_METHOD_VALUES).optional(),
  }),
});
