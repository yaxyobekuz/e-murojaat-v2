import { Router } from "express";
import requireAuth from "../../middleware/auth.js";
import requirePermission from "../../middleware/requirePermission.js";
import validate from "../../middleware/validate.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  idSchema,
  listTaxpayersSchema,
  createTaxpayerSchema,
  updateTaxpayerSchema,
  listAssessmentsSchema,
  listDebtorsSchema,
  paySchema,
  analyticsSchema,
} from "./validators/soliq.validator.js";

import listTaxpayers from "./handlers/listTaxpayers.handler.js";
import getTaxpayer from "./handlers/getTaxpayer.handler.js";
import createTaxpayer from "./handlers/createTaxpayer.handler.js";
import updateTaxpayer from "./handlers/updateTaxpayer.handler.js";
import listAssessments from "./handlers/listAssessments.handler.js";
import listDebtors from "./handlers/listDebtors.handler.js";
import pay from "./handlers/pay.handler.js";
import summary from "./handlers/analytics.summary.handler.js";
import timeseries from "./handlers/analytics.timeseries.handler.js";
import breakdown from "./handlers/analytics.breakdown.handler.js";

const router = Router();

// Analitika (aniqroq yo'llar — :id dan oldin)
router.get("/analytics/summary", requireAuth, requirePermission(PERMISSIONS.SOLIQ_READ), validate(analyticsSchema), summary);
router.get("/analytics/timeseries", requireAuth, requirePermission(PERMISSIONS.SOLIQ_READ), validate(analyticsSchema), timeseries);
router.get("/analytics/breakdown", requireAuth, requirePermission(PERMISSIONS.SOLIQ_READ), validate(analyticsSchema), breakdown);

// Soliqlar (hisob-kitoblar) va qarzdorlik
router.get("/assessments", requireAuth, requirePermission(PERMISSIONS.SOLIQ_READ), validate(listAssessmentsSchema), listAssessments);
router.get("/debtors", requireAuth, requirePermission(PERMISSIONS.SOLIQ_READ), validate(listDebtorsSchema), listDebtors);
router.post("/assessments/:id/pay", requireAuth, requirePermission(PERMISSIONS.SOLIQ_UPDATE), validate(paySchema), pay);

// To'lovchilar
router.get("/taxpayers", requireAuth, requirePermission(PERMISSIONS.SOLIQ_READ), validate(listTaxpayersSchema), listTaxpayers);
router.post("/taxpayers", requireAuth, requirePermission(PERMISSIONS.SOLIQ_CREATE), validate(createTaxpayerSchema), createTaxpayer);
router.get("/taxpayers/:id", requireAuth, requirePermission(PERMISSIONS.SOLIQ_READ), validate(idSchema), getTaxpayer);
router.patch("/taxpayers/:id", requireAuth, requirePermission(PERMISSIONS.SOLIQ_UPDATE), validate(updateTaxpayerSchema), updateTaxpayer);

export default router;
