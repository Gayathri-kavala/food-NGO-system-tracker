# Testing Guide

## Backend Unit Tests

```bash
cd backend
npm test
```

Covered:

- unsafe decision for old open-air rice
- NGO ranking favors nearby available NGOs

## Manual API Test

Start backend:

```bash
cd backend
npm run dev
```

Upload through the frontend or use an API client with multipart form data:

- `foodType`: `rice`
- `quantityMeals`: `45`
- `preparedAt`: 5 hours before current time
- `storageCondition`: `room_temp`
- `temperatureC`: `31`

Expected:

- safety: `Risky` or `Unsafe`
- reason includes time/storage risk
- top 3 NGOs returned

## ML Test

```bash
cd ml-model
python train_expiry_model.py
python predict_expiry.py --food-type rice --storage-condition room_temp --temperature-c 31 --age-hours 5
```

Expected JSON:

```json
{ "remaining_safe_hours": 0.8 }
```

The exact number may differ slightly after retraining.

