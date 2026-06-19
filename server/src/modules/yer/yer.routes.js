import { Router } from "express";
import requireAuth from "../../middleware/auth.js";
import requirePermission from "../../middleware/requirePermission.js";
import validate from "../../middleware/validate.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  listPropertiesSchema,
  idSchema as propertyIdSchema,
  createPropertySchema,
  updatePropertySchema,
} from "./validators/property.validator.js";
import {
  listRequestsSchema,
  idSchema as requestIdSchema,
  createRequestSchema,
  updateStatusSchema,
} from "./validators/request.validator.js";
import {
  summarySchema,
  timeseriesSchema,
  breakdownSchema,
  checkRegistrySchema,
} from "./validators/analytics.validator.js";

import listProperties from "./handlers/listProperties.handler.js";
import getProperty from "./handlers/getProperty.handler.js";
import createProperty from "./handlers/createProperty.handler.js";
import updateProperty from "./handlers/updateProperty.handler.js";
import listRequests from "./handlers/listRequests.handler.js";
import getRequest from "./handlers/getRequest.handler.js";
import updateRequestStatus from "./handlers/updateRequestStatus.handler.js";
import createRequest from "./handlers/createRequest.handler.js";
import checkRegistry from "./handlers/checkRegistry.handler.js";
import myProperties from "./handlers/myProperties.handler.js";
import myRequests from "./handlers/myRequests.handler.js";
import summary from "./handlers/analytics.summary.handler.js";
import timeseries from "./handlers/analytics.timeseries.handler.js";
import breakdown from "./handlers/analytics.breakdown.handler.js";

const router = Router();

// ----- Analytics (admin) -----
router.get(
  "/analytics/summary",
  requireAuth,
  requirePermission(PERMISSIONS.YER_READ),
  validate(summarySchema),
  summary,
);
router.get(
  "/analytics/timeseries",
  requireAuth,
  requirePermission(PERMISSIONS.YER_READ),
  validate(timeseriesSchema),
  timeseries,
);
router.get(
  "/analytics/breakdown",
  requireAuth,
  requirePermission(PERMISSIONS.YER_READ),
  validate(breakdownSchema),
  breakdown,
);

// ----- Open registry lookup -----
router.get(
  "/registry/check",
  requireAuth,
  validate(checkRegistrySchema),
  checkRegistry,
);

// ----- Citizen (own data) -----
router.get("/my/properties", requireAuth, myProperties);
router.get("/my/requests", requireAuth, myRequests);
router.post(
  "/my/requests",
  requireAuth,
  validate(createRequestSchema),
  createRequest,
);

// ----- Requests (admin) -----
router.get(
  "/requests",
  requireAuth,
  requirePermission(PERMISSIONS.YER_READ),
  validate(listRequestsSchema),
  listRequests,
);
router.get(
  "/requests/:id",
  requireAuth,
  requirePermission(PERMISSIONS.YER_READ),
  validate(requestIdSchema),
  getRequest,
);
router.patch(
  "/requests/:id",
  requireAuth,
  requirePermission(PERMISSIONS.YER_MANAGE),
  validate(updateStatusSchema),
  updateRequestStatus,
);

// ----- Properties (admin) -----
router.get(
  "/properties",
  requireAuth,
  requirePermission(PERMISSIONS.YER_READ),
  validate(listPropertiesSchema),
  listProperties,
);
router.post(
  "/properties",
  requireAuth,
  requirePermission(PERMISSIONS.YER_MANAGE),
  validate(createPropertySchema),
  createProperty,
);
router.get(
  "/properties/:id",
  requireAuth,
  requirePermission(PERMISSIONS.YER_READ),
  validate(propertyIdSchema),
  getProperty,
);
router.patch(
  "/properties/:id",
  requireAuth,
  requirePermission(PERMISSIONS.YER_MANAGE),
  validate(updatePropertySchema),
  updateProperty,
);

export default router;
