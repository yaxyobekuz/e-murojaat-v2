import { z } from "zod";

import { APP_ROLES } from "../auth/auth.constants.js";

export const createUserSchema = z.object({
  username: z.string().trim().min(3, "Login kamida 3 belgi").max(40),
  password: z.string().min(4, "Parol kamida 4 belgi").max(100),
  role: z.enum(APP_ROLES),
  fullName: z.string().trim().min(1, "F.I.O. majburiy").max(160),
});

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(1).max(160).optional(),
  role: z.enum(APP_ROLES).optional(),
  active: z.boolean().optional(),
  password: z.string().min(4, "Parol kamida 4 belgi").max(100).optional().or(z.literal("")),
});
