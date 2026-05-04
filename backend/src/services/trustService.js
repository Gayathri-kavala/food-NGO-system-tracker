import { memory } from "../data/memoryStore.js";
import { clamp } from "../utils/time.js";

export function updateDonorTrust(donorId, event) {
  const donor = memory.donors.find((item) => item.id === donorId);
  if (!donor) return null;
  const delta = event === "quality_accepted" ? 3 : event === "food_rejected" ? -8 : 0;
  donor.trustScore = clamp(donor.trustScore + delta, 0, 100);
  return donor;
}

export function updateNgoTrust(ngoId, event) {
  const ngo = memory.ngos.find((item) => item.id === ngoId);
  if (!ngo) return null;
  const delta = event === "timely_pickup" ? 4 : event === "late_pickup" ? -4 : event === "cancelled" ? -10 : 0;
  ngo.trustScore = clamp(ngo.trustScore + delta, 0, 100);
  return ngo;
}

export function listTrustScores() {
  return {
    donors: memory.donors.map(({ id, name, trustScore }) => ({ id, name, trustScore })),
    ngos: memory.ngos.map(({ id, name, trustScore }) => ({ id, name, trustScore }))
  };
}

