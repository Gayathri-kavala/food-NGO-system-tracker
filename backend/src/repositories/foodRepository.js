import { randomUUID } from "crypto";
import { getPool } from "../config/db.js";
import { BaseRepository } from "./baseRepository.js";

export class FoodRepository extends BaseRepository {
  constructor() {
    super("food_listings");
  }

  async create(listing) {
    const record = { id: randomUUID(), status: "analyzed", createdAt: new Date().toISOString(), ...listing };
    if (!this.useMySql) {
      this.memory.foodListings.push(record);
      return record;
    }

    const pool = getPool();
    await pool.execute(
      `INSERT INTO food_listings
       (id, donor_id, food_type, quantity_meals, image_url, prepared_at, storage_condition, temperature_c, safety_status, safety_reason, remaining_safe_hours, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.donorId,
        record.foodType,
        record.quantityMeals,
        record.imageUrl,
        record.preparedAt,
        record.storageCondition,
        record.temperatureC,
        record.safetyStatus,
        JSON.stringify(record.reasons),
        record.remainingSafeHours,
        record.status,
        record.createdAt
      ]
    );
    return record;
  }

  async list() {
    if (!this.useMySql) return [...this.memory.foodListings].reverse();
    const [rows] = await getPool().query("SELECT * FROM food_listings ORDER BY created_at DESC LIMIT 50");
    return rows;
  }
}

