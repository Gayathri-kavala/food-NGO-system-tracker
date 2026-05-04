import { hoursBetween } from "../utils/time.js";

const highRiskFoods = new Set(["rice", "curd", "paneer", "salad", "mixed_meal"]);
const perishableFoods = new Set(["rice", "dal", "sambar", "curd", "vegetable_curry", "paneer", "salad", "mixed_meal"]);

export function decideFoodSafety({ foodType, preparedAt, storageCondition, temperatureC, remainingSafeHours, visionConfidence }) {
  const ageHours = hoursBetween(preparedAt);
  const reasons = [];
  let riskPoints = 0;

  if (visionConfidence < 0.5) {
    riskPoints += 1;
    reasons.push("Food image confidence is low; manual verification recommended");
  }
  if (highRiskFoods.has(foodType)) {
    riskPoints += 1;
    reasons.push(`${humanize(foodType)} is a high-risk or fast-spoiling item`);
  } else if (perishableFoods.has(foodType)) {
    reasons.push(`${humanize(foodType)} is perishable and needs controlled handling`);
  }
  if (ageHours > 8) {
    riskPoints += 3;
    reasons.push("Food has been stored too long after preparation");
  } else if (ageHours > 4) {
    riskPoints += 1.5;
    reasons.push("Food is approaching the safe holding-time limit");
  }
  if (storageCondition === "open_air") {
    riskPoints += 2;
    reasons.push("Open-air storage increases contamination risk");
  }
  if (storageCondition === "room_temp" && ageHours > 3) {
    riskPoints += 1;
    reasons.push("Room-temperature holding beyond 3 hours is risky for cooked food");
  }
  if (temperatureC >= 32) {
    riskPoints += 1.5;
    reasons.push("High ambient temperature accelerates spoilage");
  }
  if (remainingSafeHours <= 0.5) {
    riskPoints += 3;
    reasons.push("Predicted remaining safe time is almost exhausted");
  } else if (remainingSafeHours < 2) {
    riskPoints += 1.5;
    reasons.push("Donation must be picked up urgently");
  }

  const status = riskPoints >= 5 ? "Unsafe" : riskPoints >= 2.5 ? "Risky" : "Safe";

  if (reasons.length === 0) reasons.push("Food age, storage, and predicted expiry are within donation limits");

  return { status, reasons, riskPoints: Number(riskPoints.toFixed(1)), ageHours: Number(ageHours.toFixed(2)) };
}

function humanize(value) {
  return String(value).replace(/_/g, " ");
}

