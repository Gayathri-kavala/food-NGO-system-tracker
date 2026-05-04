# API Reference

Base URL: `http://localhost:4000`

## Health

```http
GET /health
```

## Upload and Analyze Food

```http
POST /api/food/upload
Content-Type: multipart/form-data
```

Fields:

- `image`: food image
- `donorId`
- `foodType`
- `quantityMeals`
- `preparedAt`
- `storageCondition`
- `temperatureC`
- `donorLat`
- `donorLng`

Expected response:

```json
{
  "safety": {
    "status": "Risky",
    "reasons": ["Food is approaching the safe holding-time limit"]
  },
  "expiry": {
    "remainingSafeHours": 1.8
  },
  "topNgos": []
}
```

## NGO Recommendations

```http
POST /api/ngos/recommend
Content-Type: application/json
```

```json
{
  "donorLocation": { "lat": 12.9716, "lng": 77.5946 },
  "quantityMeals": 45,
  "remainingSafeHours": 2
}
```

## Assign Pickup

```http
POST /api/pickups/assign
Content-Type: application/json
```

```json
{
  "foodListingId": "listing-id",
  "ngoId": "ngo-1",
  "donorLocation": { "lat": 12.9716, "lng": 77.5946 }
}
```

## Tracking WebSocket

Connect to:

```text
ws://localhost:4000/ws/tracking
```

Message:

```json
{
  "type": "pickup_update",
  "pickup": {
    "id": "pickup-id",
    "status": "assigned"
  }
}
```

## Trust Scores

```http
GET /api/trust
POST /api/trust/donors/donor-1/events
POST /api/trust/ngos/ngo-1/events
```

Donor events:

- `quality_accepted`
- `food_rejected`

NGO events:

- `timely_pickup`
- `late_pickup`
- `cancelled`

