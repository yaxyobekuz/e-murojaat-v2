import { Router } from "express";

import validate from "../../middlewares/validate.js";
import requireAuth from "../../middlewares/requireAuth.js";
import { upsertHouseSchema } from "./houses.validators.js";
import listHouses from "./handlers/listHouses.handler.js";
import getHouse from "./handlers/getHouse.handler.js";
import upsertHouse from "./handlers/upsertHouse.handler.js";
import deleteHouse from "./handlers/deleteHouse.handler.js";

const router = Router();

// o'qish ochiq (dashboard ko'rsatadi), yozish/o'chirish — faqat owner sessiyasi
router.get("/", listHouses);
router.get("/:osmId", getHouse);
router.put("/:osmId", requireAuth, validate(upsertHouseSchema), upsertHouse);
router.delete("/:osmId", requireAuth, deleteHouse);

export default router;
