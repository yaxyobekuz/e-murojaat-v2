// E-murojaat server — xonadon ma'lumotlari (OSM id bo'yicha) uchun minimal API.
// Demo: auth yo'q, ma'lumot data/houses.json faylida saqlanadi.
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
