import { Router } from "express";

import validate from "../../middlewares/validate.js";
import requireAuth from "../../middlewares/requireAuth.js";
import { createResidentSchema, updateResidentSchema } from "./residents.validators.js";
import listResidents from "./handlers/listResidents.handler.js";
import getResident from "./handlers/getResident.handler.js";
import createResident from "./handlers/createResident.handler.js";
import updateResident from "./handlers/updateResident.handler.js";
import deleteResident from "./handlers/deleteResident.handler.js";

const router = Router();

// o'qish ochiq (ro'yxat ko'rsatadi), yozish/o'chirish — faqat owner sessiyasi
router.get("/", listResidents);
router.get("/:id", getResident);
router.post("/", requireAuth, validate(createResidentSchema), createResident);
router.put("/:id", requireAuth, validate(updateResidentSchema), updateResident);
router.delete("/:id", requireAuth, deleteResident);

export default router;
