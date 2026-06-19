import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import usersRouter from "../modules/users/users.routes.js";
import activityLogsRouter from "../modules/activityLogs/activityLogs.routes.js";
import soliqRouter from "../modules/soliq/soliq.routes.js";

const router = Router();

router.get("/health", (_req, res) =>
  res.json({ success: true, message: "Server ishlayapti" }),
);

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/activity-logs", activityLogsRouter);
router.use("/soliq", soliqRouter);

export default router;
