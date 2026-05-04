# Architecture

## Request Flow

1. Donor uploads food image and metadata.
2. Backend infers food type from assisted image logic.
3. Expiry predictor estimates remaining safe hours.
4. Safety decision engine combines ML prediction, food type, time, storage, temperature, and image confidence.
5. NGO selector ranks top 3 NGOs by urgency, inverse distance, capacity, and trust.
6. Pickup assignment creates a tracking record and notification.
7. WebSocket broadcasts live pickup updates.
8. Trust scores adjust after accepted/rejected food or pickup outcomes.

## Human-Like Decision Logic

The decision engine does more than classify. It explains risk:

- cooked rice is high risk
- open-air storage raises contamination risk
- room temperature beyond 3 hours is risky
- high temperature accelerates spoilage
- low remaining safe time makes the pickup urgent

This mirrors how a food coordinator reasons under uncertainty.

## NGO Score

```text
score =
  urgency_weight * urgency +
  distance_weight * inverse_distance +
  capacity_weight * availability +
  trust_weight * trust
```

Default weights:

- urgency: `0.45`
- inverse distance: `0.30`
- availability: `0.20`
- trust: `0.05`

## Trust Score Updates

Donors:

- accepted quality: `+3`
- rejected food: `-8`

NGOs:

- timely pickup: `+4`
- late pickup: `-4`
- cancellation: `-10`

Scores are clamped between `0` and `100`.

