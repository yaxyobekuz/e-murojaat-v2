import { Router } from "express";

import validate from "../../middlewares/validate.js";
import requireAuth from "../../middlewares/requireAuth.js";
import { upsertOfficialSchema } from "./officials.validators.js";
import listOfficials from "./handlers/listOfficials.handler.js";
import getOfficial from "./handlers/getOfficial.handler.js";
import upsertOfficial from "./handlers/upsertOfficial.handler.js";
import deleteOfficial from "./handlers/deleteOfficial.handler.js";

const router = Router();

// o'qish ochiq, yozish/o'chirish — faqat owner sessiyasi
router.get("/", listOfficials);
router.get("/:role", getOfficial);
router.put("/:role", requireAuth, validate(upsertOfficialSchema), upsertOfficial);
router.delete("/:role", requireAuth, deleteOfficial);

export default router;
