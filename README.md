# AI Mess Food Redistribution System

A production-oriented teaching project for detecting leftover mess/cafeteria food, deciding donation safety, predicting expiry, recommending NGOs, tracking pickups in real time, and maintaining trust scores.

This is intentionally **not** a basic CRUD app. The backend combines rule-based reasoning, ML expiry prediction, geospatial scoring, WebSocket tracking, notifications, and trust updates to simulate human-like operational decisions.

## Project Structure

```text
/backend      Express REST API, decision engines, WebSocket tracking
/frontend     React + Vite dashboard
/ml-model     Python training and prediction scripts with sample data
/database     MySQL schema and seed data
/docs         Setup, architecture, API examples, testing guide
```

## Quick Start

See [docs/SETUP.md](docs/SETUP.md) for the full beginner-friendly setup.

```bash
cd backend
cp .env.example .env
npm install
npm run dev

cd ../frontend
cp .env.example .env
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:4000`.

## Main Capabilities

- Upload food image + preparation/storage details.
- Classify food risk as `Safe`, `Risky`, or `Unsafe` with human-readable reasons.
- Predict remaining safe time using a hybrid ML + rules approach.
- Rank top 3 NGOs with urgency, distance, and capacity scoring.
- Assign pickup and stream live location/status via WebSockets.
- Update donor and NGO trust scores based on real outcomes.
- Log decisions for future model improvement.

## Why These Components Are Used

- **Express**: lightweight API layer with clear middleware and service boundaries.
- **MySQL**: relational data suits donors, NGOs, food listings, pickups, trust scores, and logs.
- **React**: interactive dashboards, uploads, recommendations, and map-like tracking views.
- **scikit-learn**: practical tabular ML for expiry prediction from food type, age, temperature, and storage.
- **OpenCV**: image preprocessing hook for future CNN/pretrained food recognition.
- **WebSockets**: push live pickup status without constant refresh.
- **Google Maps API-ready adapter**: real distance can be plugged in; Haversine fallback keeps demos working.

## Sample Expected Output

Upload cooked rice prepared 5 hours ago at room temperature:

```json
{
  "decision": "Risky",
  "reasons": ["Cooked rice is highly perishable", "Food has been outside safe storage for too long"],
  "remainingSafeHours": 1.2,
  "topNgos": [
    { "name": "Hope Meals Foundation", "score": 0.88 },
    { "name": "Care Home Trust", "score": 0.74 },
    { "name": "Little Stars Orphanage", "score": 0.69 }
  ]
}
```

## Documentation

- [Installation and Setup](docs/SETUP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Testing Guide](docs/TESTING.md)

