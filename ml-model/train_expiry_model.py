from pathlib import Path
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "sample_food_expiry.csv"
MODEL = ROOT / "models" / "expiry_model.joblib"


def main():
    df = pd.read_csv(DATA)
    x = df[["food_type", "storage_condition", "temperature_c", "age_hours"]]
    y = df["remaining_safe_hours"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("categorical", OneHotEncoder(handle_unknown="ignore"), ["food_type", "storage_condition"]),
            ("numeric", "passthrough", ["temperature_c", "age_hours"]),
        ]
    )

    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", RandomForestRegressor(n_estimators=120, random_state=42)),
        ]
    )

    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25, random_state=42)
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    mae = mean_absolute_error(y_test, predictions)

    MODEL.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL)
    print(f"Saved {MODEL}")
    print(f"Validation MAE: {mae:.2f} hours")


if __name__ == "__main__":
    main()

