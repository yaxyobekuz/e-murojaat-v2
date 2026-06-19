import { Router } from "express";
import requireAuth from "../../middleware/auth.js";
import requirePermission from "../../middleware/requirePermission.js";
import validate from "../../middleware/validate.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  listAppealsSchema,
  idSchema,
  createAppealSchema,
  updateAppealSchema,
  trackSchema,
} from "./validators/appeal.validator.js";
import { createOrganizationSchema } from "./validators/organization.validator.js";
import {
  summarySchema,
  timeseriesSchema,
  breakdownSchema,
} from "./validators/analytics.validator.js";

import listAppeals from "./handlers/listAppeals.handler.js";
import getAppeal from "./handlers/getAppeal.handler.js";
import updateAppeal from "./handlers/updateAppeal.handler.js";
import createAppeal from "./handlers/createAppeal.handler.js";
import myAppeals from "./handlers/myAppeals.handler.js";
import trackAppeal from "./handlers/trackAppeal.handler.js";
import listOrganizations from "./handlers/listOrganizations.handler.js";
import createOrganization from "./handlers/createOrganization.handler.js";
import summary from "./handlers/analytics.summary.handler.js";
import timeseries from "./handlers/analytics.timeseries.handler.js";
import breakdown from "./handlers/analytics.breakdown.handler.js";

const router = Router();

// ----- Analytics (admin) -----
router.get(
  "/analytics/summary",
  requireAuth,
  requirePermission(PERMISSIONS.MUROJAAT_READ),
  validate(summarySchema),
  summary,
);
router.get(
  "/analytics/timeseries",
  requireAuth,
  requirePermission(PERMISSIONS.MUROJAAT_READ),
  validate(timeseriesSchema),
  timeseries,
);
router.get(
  "/analytics/breakdown",
  requireAuth,
  requirePermission(PERMISSIONS.MUROJAAT_READ),
  validate(breakdownSchema),
  breakdown,
);

// ----- Public tracking (no login required) -----
router.get("/track", validate(trackSchema), trackAppeal);

// ----- Organizations -----
router.get("/organizations", requireAuth, listOrganizations);
router.post(
  "/organizations",
  requireAuth,
  requirePermission(PERMISSIONS.MUROJAAT_MANAGE),
  validate(createOrganizationSchema),
  createOrganization,
);

// ----- Citizen (own data) -----
router.get("/my/appeals", requireAuth, myAppeals);
router.post("/my/appeals", requireAuth, validate(createAppealSchema), createAppeal);

// ----- Appeals (admin) -----
router.get(
  "/appeals",
  requireAuth,
  requirePermission(PERMISSIONS.MUROJAAT_READ),
  validate(listAppealsSchema),
  listAppeals,
);
router.get(
  "/appeals/:id",
  requireAuth,
  requirePermission(PERMISSIONS.MUROJAAT_READ),
  validate(idSchema),
  getAppeal,
);
router.patch(
  "/appeals/:id",
  requireAuth,
  requirePermission(PERMISSIONS.MUROJAAT_MANAGE),
  validate(updateAppealSchema),
  updateAppeal,
);

export default router;
