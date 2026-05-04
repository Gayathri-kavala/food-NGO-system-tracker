import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../config/env.js";
import { clamp, hoursBetween } from "../utils/time.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseShelfLife = {
  rice: 6,
  dal: 8,
  sambar: 6,
  curd: 4,
  chapati: 10,
  idli: 8,
  dosa: 6,
  vegetable_curry: 7,
  paneer: 5,
  salad: 3,
  mixed_meal: 5
};

const storageMultipliers = {
  refrigerated: 1.8,
  insulated: 1.25,
  room_temp: 1,
  open_air: 0.65,
  hot_case: 1.15
};

export async function predictRemainingSafeHours({ foodType, preparedAt, storageCondition, temperatureC }) {
  const ageHours = hoursBetween(preparedAt);
  const mlPrediction = await tryPythonPrediction({ foodType, ageHours, storageCondition, temperatureC });
  const rulePrediction = ruleBasedRemainingHours({ foodType, ageHours, storageCondition, temperatureC });

  if (mlPrediction !== null) {
    return Number(clamp(mlPrediction * 0.65 + rulePrediction * 0.35, 0, 36).toFixed(2));
  }
  return Number(rulePrediction.toFixed(2));
}

function ruleBasedRemainingHours({ foodType, ageHours, storageCondition, temperatureC }) {
  const base = baseShelfLife[foodType] || baseShelfLife.mixed_meal;
  const storage = storageMultipliers[storageCondition] || 1;
  const tempPenalty = temperatureC > 30 ? 0.7 : temperatureC > 25 ? 0.85 : 1;
  return clamp(base * storage * tempPenalty - ageHours, 0, 36);
}

function tryPythonPrediction(input) {
  return new Promise((resolve) => {
    const script = path.resolve(__dirname, "../../", config.mlPredictScript);
    const child = spawn("python", [
      script,
      "--food-type",
      input.foodType,
      "--age-hours",
      String(input.ageHours),
      "--storage-condition",
      input.storageCondition,
      "--temperature-c",
      String(input.temperatureC)
    ]);

    let stdout = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.on("error", () => resolve(null));
    child.on("close", (code) => {
      if (code !== 0) return resolve(null);
      try {
        const parsed = JSON.parse(stdout);
        resolve(Number.isFinite(parsed.remaining_safe_hours) ? parsed.remaining_safe_hours : null);
      } catch {
        resolve(null);
      }
    });
  });
}

