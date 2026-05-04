import test from "node:test";
import assert from "node:assert/strict";
import { decideFoodSafety } from "../src/services/safetyDecisionEngine.js";
import { rankNgos } from "../src/services/ngoSelectionService.js";

test("marks old open-air rice as unsafe", () => {
  const preparedAt = new Date(Date.now() - 9 * 36e5).toISOString();
  const result = decideFoodSafety({
    foodType: "rice",
    preparedAt,
    storageCondition: "open_air",
    temperatureC: 33,
    remainingSafeHours: 0,
    visionConfidence: 0.9
  });
  assert.equal(result.status, "Unsafe");
  assert.ok(result.reasons.length >= 3);
});

test("ranks nearby available NGO higher", () => {
  const top = rankNgos({
    donorLocation: { lat: 12.97, lng: 77.59 },
    quantityMeals: 50,
    remainingSafeHours: 1,
    ngos: [
      { id: "far", name: "Far", lat: 13.2, lng: 77.9, capacityMeals: 100, currentLoad: 0, trustScore: 80 },
      { id: "near", name: "Near", lat: 12.971, lng: 77.592, capacityMeals: 100, currentLoad: 10, trustScore: 80 }
    ]
  });
  assert.equal(top[0].id, "near");
});

