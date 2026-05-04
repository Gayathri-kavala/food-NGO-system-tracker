import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { analyzeAndCreateFoodListing, listFoodListings } from "../services/foodAnalysisService.js";

const router = Router();

router.post("/upload", upload.single("image"), async (req, res, next) => {
  try {
    const result = await analyzeAndCreateFoodListing({ body: req.body, file: req.file });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/listings", async (_req, res, next) => {
  try {
    res.json({ listings: await listFoodListings() });
  } catch (err) {
    next(err);
  }
});

export default router;

