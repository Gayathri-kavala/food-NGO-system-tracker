import { Router } from "express";
import { NgoRepository } from "../repositories/ngoRepository.js";
import { rankNgos } from "../services/ngoSelectionService.js";

const router = Router();
const repo = new NgoRepository();

router.get("/", async (_req, res, next) => {
  try {
    res.json({ ngos: await repo.list() });
  } catch (err) {
    next(err);
  }
});

router.post("/recommend", async (req, res, next) => {
  try {
    const ngos = await repo.list();
    const topNgos = rankNgos({
      donorLocation: req.body.donorLocation,
      ngos,
      quantityMeals: Number(req.body.quantityMeals || 20),
      remainingSafeHours: Number(req.body.remainingSafeHours || 4)
    });
    res.json({ topNgos });
  } catch (err) {
    next(err);
  }
});

export default router;

