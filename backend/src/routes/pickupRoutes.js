import { Router } from "express";
import { NgoRepository } from "../repositories/ngoRepository.js";
import { PickupRepository } from "../repositories/pickupRepository.js";
import { notify } from "../services/notificationService.js";
import { updateNgoTrust } from "../services/trustService.js";
import { broadcastPickupUpdate } from "../tracking/trackingSocket.js";

const router = Router();
const pickupRepo = new PickupRepository();
const ngoRepo = new NgoRepository();

router.post("/assign", async (req, res, next) => {
  try {
    const { foodListingId, ngoId, donorLocation } = req.body;
    const ngo = await ngoRepo.findById(ngoId);
    if (!ngo) return res.status(404).json({ error: "NGO not found" });

    const pickup = await pickupRepo.create({
      foodListingId,
      ngoId,
      startLat: Number(donorLocation?.lat || ngo.lat),
      startLng: Number(donorLocation?.lng || ngo.lng),
      etaMinutes: 28
    });

    notify("pickup_assigned", ngoId, `Pickup assigned for listing ${foodListingId}`, { pickupId: pickup.id });
    broadcastPickupUpdate(pickup);
    res.status(201).json({ pickup });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const pickup = await pickupRepo.findById(req.params.id);
    if (!pickup) return res.status(404).json({ error: "Pickup not found" });
    res.json({ pickup });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const pickup = await pickupRepo.update(req.params.id, req.body);
    if (!pickup) return res.status(404).json({ error: "Pickup not found" });
    if (req.body.status === "picked_up") updateNgoTrust(pickup.ngoId, "timely_pickup");
    if (req.body.status === "cancelled") updateNgoTrust(pickup.ngoId, "cancelled");
    broadcastPickupUpdate(pickup);
    res.json({ pickup });
  } catch (err) {
    next(err);
  }
});

export default router;

