import { Router } from "express";
import requireAuth from "../../middleware/auth.js";
import requirePermission from "../../middleware/requirePermission.js";
import validate from "../../middleware/validate.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  listSubscribersSchema,
  listDebtorsSchema,
  idSchema as subscriberIdSchema,
} from "./validators/subscriber.validator.js";
import {
  listRequestsSchema,
  idSchema as requestIdSchema,
  createRequestSchema,
  updateStatusSchema,
  createPaymentSchema,
} from "./validators/request.validator.js";
import {
  summarySchema,
  timeseriesSchema,
  breakdownSchema,
  checkRegistrySchema,
} from "./validators/analytics.validator.js";

import listSubscribers from "./handlers/listSubscribers.handler.js";
import getSubscriber from "./handlers/getSubscriber.handler.js";
import listDebtors from "./handlers/listDebtors.handler.js";
import listPayments from "./handlers/listPayments.handler.js";
import getTariff from "./handlers/getTariff.handler.js";
import listRequests from "./handlers/listRequests.handler.js";
import getRequest from "./handlers/getRequest.handler.js";
import updateRequestStatus from "./handlers/updateRequestStatus.handler.js";
import createRequest from "./handlers/createRequest.handler.js";
import checkRegistry from "./handlers/checkRegistry.handler.js";
import myAccount from "./handlers/myAccount.handler.js";
import myUsage from "./handlers/myUsage.handler.js";
import myPayments from "./handlers/myPayments.handler.js";
import myRequests from "./handlers/myRequests.handler.js";
import createPayment from "./handlers/createPayment.handler.js";
import summary from "./handlers/analytics.summary.handler.js";
import timeseries from "./handlers/analytics.timeseries.handler.js";
import breakdown from "./handlers/analytics.breakdown.handler.js";

const router = Router();

// ----- Analytics (admin) -----
router.get(
  "/analytics/summary",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_READ),
  validate(summarySchema),
  summary,
);
router.get(
  "/analytics/timeseries",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_READ),
  validate(timeseriesSchema),
  timeseries,
);
router.get(
  "/analytics/breakdown",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_READ),
  validate(breakdownSchema),
  breakdown,
);

// ----- Open registry lookup -----
router.get("/registry/check", requireAuth, validate(checkRegistrySchema), checkRegistry);

// ----- Citizen (own data) -----
router.get("/my/account", requireAuth, myAccount);
router.get("/my/usage", requireAuth, myUsage);
router.get("/my/payments", requireAuth, myPayments);
router.post("/my/payments", requireAuth, validate(createPaymentSchema), createPayment);
router.get("/my/requests", requireAuth, myRequests);
router.post("/my/requests", requireAuth, validate(createRequestSchema), createRequest);

// ----- Tariff (admin) -----
router.get("/tariff", requireAuth, requirePermission(PERMISSIONS.GAZ_READ), getTariff);

// ----- Payments / Debt (admin) -----
router.get(
  "/payments",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_READ),
  listPayments,
);
router.get(
  "/debtors",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_READ),
  validate(listDebtorsSchema),
  listDebtors,
);

// ----- Requests (admin) -----
router.get(
  "/requests",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_READ),
  validate(listRequestsSchema),
  listRequests,
);
router.get(
  "/requests/:id",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_READ),
  validate(requestIdSchema),
  getRequest,
);
router.patch(
  "/requests/:id",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_MANAGE),
  validate(updateStatusSchema),
  updateRequestStatus,
);

// ----- Subscribers (admin) -----
router.get(
  "/subscribers",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_READ),
  validate(listSubscribersSchema),
  listSubscribers,
);
router.get(
  "/subscribers/:id",
  requireAuth,
  requirePermission(PERMISSIONS.GAZ_READ),
  validate(subscriberIdSchema),
  getSubscriber,
);

export default router;
