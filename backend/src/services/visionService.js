const knownFoods = ["rice", "dal", "sambar", "curd", "chapati", "idli", "dosa", "vegetable_curry", "paneer", "salad"];

export function inferFoodFromImage(file, declaredFoodType) {
  if (declaredFoodType) {
    return { foodType: normalizeFood(declaredFoodType), confidence: 0.92, source: "user_assisted_vision" };
  }

  const name = `${file?.originalname || ""} ${file?.filename || ""}`.toLowerCase();
  const match = knownFoods.find((food) => name.includes(food.replace("_", "")) || name.includes(food.replace("_", " ")));

  return {
    foodType: match || "mixed_meal",
    confidence: match ? 0.68 : 0.41,
    source: match ? "filename_heuristic" : "unknown_image_fallback"
  };
}

function normalizeFood(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, "_");
}

