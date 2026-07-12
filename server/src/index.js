// E-murojaat server — xonadon, aholi va mahalla yettiligi ma'lumotlari uchun API.
// Ma'lumotlar MongoDB'da saqlanadi (Mongoose).
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDb } from "./config/db.js";
import { importLegacyJson } from "./config/importJson.js";
import authRoutes from "./modules/auth/auth.routes.js";
import housesRoutes from "./modules/houses/houses.routes.js";
import residentsRoutes from "./modules/residents/residents.routes.js";
import officialsRoutes from "./modules/officials/officials.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 8032;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ success: true, data: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/houses", housesRoutes);
app.use("/api/residents", residentsRoutes);
app.use("/api/officials", officialsRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: "Topilmadi", code: "NOT_FOUND" }));
app.use(errorHandler);

const start = async () => {
  await connectDb();
  await importLegacyJson();
  app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
};

start().catch((err) => {
  console.error("Server ishga tushmadi:", err.message);
  process.exit(1);
});
