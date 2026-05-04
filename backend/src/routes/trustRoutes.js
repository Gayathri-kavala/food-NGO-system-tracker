import { Router } from "express";
import { listTrustScores, updateDonorTrust, updateNgoTrust } from "../services/trustService.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(listTrustScores());
});

router.post("/donors/:id/events", (req, res) => {
  const donor = updateDonorTrust(req.params.id, req.body.event);
  if (!donor) return res.status(404).json({ error: "Donor not found" });
  res.json({ donor });
});

router.post("/ngos/:id/events", (req, res) => {
  const ngo = updateNgoTrust(req.params.id, req.body.event);
  if (!ngo) return res.status(404).json({ error: "NGO not found" });
  res.json({ ngo });
});

export default router;

