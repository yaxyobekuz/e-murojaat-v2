import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import usersRouter from "../modules/users/users.routes.js";
import activityLogsRouter from "../modules/activityLogs/activityLogs.routes.js";
import soliqRouter from "../modules/soliq/soliq.routes.js";
import yerRouter from "../modules/yer/yer.routes.js";
import gazRouter from "../modules/gaz/gaz.routes.js";
import murojaatRouter from "../modules/murojaat/murojaat.routes.js";
import svetRouter from "../modules/svet/svet.routes.js";

const router = Router();

router.get("/health", (_req, res) =>
  res.json({ success: true, message: "Server ishlayapti" }),
);

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/activity-logs", activityLogsRouter);
router.use("/soliq", soliqRouter);
router.use("/yer", yerRouter);
router.use("/gaz", gazRouter);
router.use("/murojaat", murojaatRouter);
router.use("/svet", svetRouter);

export default router;
