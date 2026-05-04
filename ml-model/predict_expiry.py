import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODEL = ROOT / "models" / "expiry_model.joblib"


def fallback(food_type, storage_condition, temperature_c, age_hours):
    base = {
        "rice": 6,
        "dal": 8,
        "sambar": 6,
        "curd": 4,
        "chapati": 10,
        "idli": 8,
        "dosa": 6,
        "vegetable_curry": 7,
        "paneer": 5,
        "salad": 3,
        "mixed_meal": 5,
    }.get(food_type, 5)
    storage = {
        "refrigerated": 1.8,
        "insulated": 1.25,
        "room_temp": 1,
        "open_air": 0.65,
        "hot_case": 1.15,
    }.get(storage_condition, 1)
    temp_penalty = 0.7 if temperature_c > 30 else 0.85 if temperature_c > 25 else 1
    return max(0, min(36, base * storage * temp_penalty - age_hours))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--food-type", required=True)
    parser.add_argument("--storage-condition", required=True)
    parser.add_argument("--temperature-c", type=float, required=True)
    parser.add_argument("--age-hours", type=float, required=True)
    args = parser.parse_args()

    if MODEL.exists():
        import joblib
        import pandas as pd

        row = pd.DataFrame(
            [
                {
                    "food_type": args.food_type,
                    "storage_condition": args.storage_condition,
                    "temperature_c": args.temperature_c,
                    "age_hours": args.age_hours,
                }
            ]
        )
        model = joblib.load(MODEL)
        prediction = float(model.predict(row)[0])
    else:
        prediction = fallback(args.food_type, args.storage_condition, args.temperature_c, args.age_hours)

    print(json.dumps({"remaining_safe_hours": round(max(0, prediction), 2)}))


if __name__ == "__main__":
    main()
