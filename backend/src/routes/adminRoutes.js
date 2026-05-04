import { Router } from "express";
import { LogRepository } from "../repositories/logRepository.js";
import { listNotifications } from "../services/notificationService.js";
import { memory } from "../data/memoryStore.js";

const router = Router();
const logs = new LogRepository();

router.get("/summary", async (_req, res, next) => {
  try {
    res.json({
      donors: memory.donors.length,
      ngos: memory.ngos.length,
      listings: memory.foodListings.length,
      pickups: memory.pickups.length,
      notifications: memory.notifications.length,
      recentLogs: await logs.list()
    });
  } catch (err) {
    next(err);
  }
});

router.get("/notifications", (_req, res) => {
  res.json({ notifications: listNotifications() });
});

export default router;

