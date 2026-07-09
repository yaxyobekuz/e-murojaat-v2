import { Router } from "express";

import validate from "../../middlewares/validate.js";
import { loginSchema } from "./auth.validators.js";
import login from "./handlers/login.handler.js";
import me from "./handlers/me.handler.js";
import logout from "./handlers/logout.handler.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.get("/me", me);
router.post("/logout", logout);

export default router;
