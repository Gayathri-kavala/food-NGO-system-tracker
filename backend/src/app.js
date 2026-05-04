import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import foodRoutes from "./routes/foodRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import pickupRoutes from "./routes/pickupRoutes.js";
import trustRoutes from "./routes/trustRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.frontendOrigin }));
  app.use(express.json({ limit: "2mb" }));
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "ai-mess-food-redistribution", mode: config.useMySql ? "mysql" : "memory" });
  });

  app.use("/api/food", foodRoutes);
  app.use("/api/ngos", ngoRoutes);
  app.use("/api/pickups", pickupRoutes);
  app.use("/api/trust", trustRoutes);
  app.use("/api/admin", adminRoutes);
  app.use(errorHandler);

  return app;
}

