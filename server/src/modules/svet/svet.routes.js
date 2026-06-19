import { Router } from "express";
import requireAuth from "../../middleware/auth.js";
import requirePermission from "../../middleware/requirePermission.js";
import validate from "../../middleware/validate.js";
import { PERMISSIONS } from "../../constants/permissions.js";

import {
  listSubscribersSchema,
  idSchema as subscriberIdSchema,
  updateSubscriberSchema,
  checkAccountSchema,
} from "./validators/subscriber.validator.js";
import {
  listRequestsSchema,
  idSchema as requestIdSchema,
  createRequestSchema,
  updateStatusSchema,
} from "./validators/request.validator.js";
import { createPaymentSchema } from "./validators/payment.validator.js";
import { listViolationsSchema } from "./validators/violation.validator.js";
import {
  summarySchema,
  timeseriesSchema,
  breakdownSchema,
} from "./validators/analytics.validator.js";

import listSubscribers from "./handlers/listSubscribers.handler.js";
import getSubscriber from "./handlers/getSubscriber.handler.js";
import updateSubscriber from "./handlers/updateSubscriber.handler.js";
import listRequests from "./handlers/listRequests.handler.js";
import getRequest from "./handlers/getRequest.handler.js";
import updateRequestStatus from "./handlers/updateRequestStatus.handler.js";
import listViolations from "./handlers/listViolations.handler.js";
import checkAccount from "./handlers/checkAccount.handler.js";
import mySubscriber from "./handlers/mySubscriber.handler.js";
import myRequests from "./handlers/myRequests.handler.js";
import createRequest from "./handlers/createRequest.handler.js";
import createPayment from "./handlers/createPayment.handler.js";
import summary from "./handlers/analytics.summary.handler.js";
import timeseries from "./handlers/analytics.timeseries.handler.js";
import breakdown from "./handlers/analytics.breakdown.handler.js";

const router = Router();

// ----- Analytics (admin) -----
router.get(
  "/analytics/summary",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_READ),
  validate(summarySchema),
  summary,
);
router.get(
  "/analytics/timeseries",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_READ),
  validate(timeseriesSchema),
  timeseries,
);
router.get(
  "/analytics/breakdown",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_READ),
  validate(breakdownSchema),
  breakdown,
);

// ----- Open account lookup -----
router.get("/account/check", requireAuth, validate(checkAccountSchema), checkAccount);

// ----- Citizen (own data) -----
router.get("/my/account", requireAuth, mySubscriber);
router.get("/my/requests", requireAuth, myRequests);
router.post("/my/requests", requireAuth, validate(createRequestSchema), createRequest);
router.post("/my/payments", requireAuth, validate(createPaymentSchema), createPayment);

// ----- Requests (admin) -----
router.get(
  "/requests",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_READ),
  validate(listRequestsSchema),
  listRequests,
);
router.get(
  "/requests/:id",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_READ),
  validate(requestIdSchema),
  getRequest,
);
router.patch(
  "/requests/:id",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_MANAGE),
  validate(updateStatusSchema),
  updateRequestStatus,
);

// ----- Violations / e-dalolatnoma (admin) -----
router.get(
  "/violations",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_READ),
  validate(listViolationsSchema),
  listViolations,
);

// ----- Subscribers (admin) -----
router.get(
  "/subscribers",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_READ),
  validate(listSubscribersSchema),
  listSubscribers,
);
router.get(
  "/subscribers/:id",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_READ),
  validate(subscriberIdSchema),
  getSubscriber,
);
router.patch(
  "/subscribers/:id",
  requireAuth,
  requirePermission(PERMISSIONS.SVET_MANAGE),
  validate(updateSubscriberSchema),
  updateSubscriber,
);

export default router;
