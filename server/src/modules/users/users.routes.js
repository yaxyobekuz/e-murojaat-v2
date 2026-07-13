import { Router } from "express";

import validate from "../../middlewares/validate.js";
import requireRole from "../../middlewares/requireRole.js";
import { createUserSchema, updateUserSchema } from "./users.validators.js";
import listUsers from "./handlers/listUsers.handler.js";
import createUser from "./handlers/createUser.handler.js";
import updateUser from "./handlers/updateUser.handler.js";
import deleteUser from "./handlers/deleteUser.handler.js";

const router = Router();

// faqat owner — requireRole() owner'ni o'tkazadi, boshqa rollarni 403
router.get("/", requireRole(), listUsers);
router.post("/", requireRole(), validate(createUserSchema), createUser);
router.patch("/:id", requireRole(), validate(updateUserSchema), updateUser);
router.delete("/:id", requireRole(), deleteUser);

export default router;
