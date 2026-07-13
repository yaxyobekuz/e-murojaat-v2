import { Router } from "express";

import validate from "../../middlewares/validate.js";
import requireAuth from "../../middlewares/requireAuth.js";
import { patchIndicatorSchema } from "./mahalla.validators.js";
import getIndicators from "./handlers/getIndicators.handler.js";
import patchIndicator from "./handlers/patchIndicator.handler.js";

const router = Router();

// o'qish ochiq (dashboard ko'rsatadi); yozish — login + domen mas'uli (service tekshiradi)
router.get("/indicators", getIndicators);
router.patch("/indicators/:domain", requireAuth, validate(patchIndicatorSchema), patchIndicator);

export default router;
