import { haversineKm } from "../utils/geo.js";
import { clamp } from "../utils/time.js";

const weights = {
  urgency: 0.45,
  inverseDistance: 0.3,
  availability: 0.2,
  trust: 0.05
};

export function rankNgos({ donorLocation, ngos, quantityMeals, remainingSafeHours }) {
  const urgency = clamp(1 - remainingSafeHours / 12, 0, 1);

  return ngos
    .map((ngo) => {
      const distanceKm = haversineKm(donorLocation, { lat: Number(ngo.lat), lng: Number(ngo.lng) });
      const inverseDistance = 1 / (1 + distanceKm);
      const availableMeals = Math.max(0, Number(ngo.capacityMeals) - Number(ngo.currentLoad));
      const availability = clamp(availableMeals / Math.max(1, Number(quantityMeals)), 0, 1);
      const trust = clamp(Number(ngo.trustScore || 50) / 100, 0, 1);
      const score =
        weights.urgency * urgency +
        weights.inverseDistance * inverseDistance +
        weights.availability * availability +
        weights.trust * trust;

      return {
        ...ngo,
        distanceKm: Number(distanceKm.toFixed(2)),
        availableMeals,
        urgency: Number(urgency.toFixed(2)),
        score: Number(score.toFixed(4)),
        explanation: [
          `Urgency ${urgency.toFixed(2)} from remaining safe time`,
          `${distanceKm.toFixed(2)} km away`,
          `${availableMeals} meal capacity available`,
          `Trust score ${ngo.trustScore}`
        ]
      };
    })
    .filter((ngo) => ngo.availableMeals > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

