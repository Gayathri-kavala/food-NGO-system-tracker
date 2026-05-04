import { FoodRepository } from "../repositories/foodRepository.js";
import { LogRepository } from "../repositories/logRepository.js";
import { NgoRepository } from "../repositories/ngoRepository.js";
import { inferFoodFromImage } from "./visionService.js";
import { predictRemainingSafeHours } from "./expiryPredictor.js";
import { decideFoodSafety } from "./safetyDecisionEngine.js";
import { rankNgos } from "./ngoSelectionService.js";

const foodRepo = new FoodRepository();
const ngoRepo = new NgoRepository();
const logRepo = new LogRepository();

export async function analyzeAndCreateFoodListing({ body, file }) {
  const donorLocation = {
    lat: Number(body.donorLat || 12.9716),
    lng: Number(body.donorLng || 77.5946)
  };
  const vision = inferFoodFromImage(file, body.foodType);
  const preparedAt = body.preparedAt || new Date(Date.now() - 2 * 36e5).toISOString();
  const storageCondition = body.storageCondition || "room_temp";
  const temperatureC = Number(body.temperatureC || 28);
  const quantityMeals = Number(body.quantityMeals || 25);

  const remainingSafeHours = await predictRemainingSafeHours({
    foodType: vision.foodType,
    preparedAt,
    storageCondition,
    temperatureC
  });

  const safety = decideFoodSafety({
    foodType: vision.foodType,
    preparedAt,
    storageCondition,
    temperatureC,
    remainingSafeHours,
    visionConfidence: vision.confidence
  });

  const ngos = await ngoRepo.list();
  const topNgos = rankNgos({ donorLocation, ngos, quantityMeals, remainingSafeHours });

  const listing = await foodRepo.create({
    donorId: body.donorId || "donor-1",
    donorLocation,
    foodType: vision.foodType,
    vision,
    quantityMeals,
    imageUrl: file ? `/uploads/${file.filename}` : null,
    preparedAt,
    storageCondition,
    temperatureC,
    safetyStatus: safety.status,
    reasons: safety.reasons,
    riskPoints: safety.riskPoints,
    ageHours: safety.ageHours,
    remainingSafeHours,
    topNgos
  });

  await logRepo.create("food_analyzed", { listingId: listing.id, safety, vision, remainingSafeHours, topNgoIds: topNgos.map((ngo) => ngo.id) });

  return { listing, safety, expiry: { remainingSafeHours }, topNgos };
}

export async function listFoodListings() {
  return foodRepo.list();
}

