import { randomUUID } from "crypto";
import { getPool } from "../config/db.js";
import { BaseRepository } from "./baseRepository.js";

export class PickupRepository extends BaseRepository {
  constructor() {
    super("pickups");
  }

  async create(pickup) {
    const record = {
      id: randomUUID(),
      status: "assigned",
      driverLat: pickup.startLat,
      driverLng: pickup.startLng,
      assignedAt: new Date().toISOString(),
      etaMinutes: pickup.etaMinutes || 30,
      ...pickup
    };

    if (!this.useMySql) {
      this.memory.pickups.push(record);
      return record;
    }

    await getPool().execute(
      `INSERT INTO pickups
       (id, food_listing_id, ngo_id, status, driver_lat, driver_lng, eta_minutes, assigned_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [record.id, record.foodListingId, record.ngoId, record.status, record.driverLat, record.driverLng, record.etaMinutes, record.assignedAt]
    );
    return record;
  }

  async findById(id) {
    if (!this.useMySql) return this.memory.pickups.find((pickup) => pickup.id === id);
    const [rows] = await getPool().execute("SELECT * FROM pickups WHERE id = ?", [id]);
    return rows[0];
  }

  async update(id, patch) {
    if (!this.useMySql) {
      const pickup = this.memory.pickups.find((item) => item.id === id);
      if (!pickup) return null;
      Object.assign(pickup, patch, { updatedAt: new Date().toISOString() });
      return pickup;
    }

    await getPool().execute(
      "UPDATE pickups SET status = COALESCE(?, status), driver_lat = COALESCE(?, driver_lat), driver_lng = COALESCE(?, driver_lng), eta_minutes = COALESCE(?, eta_minutes), updated_at = NOW() WHERE id = ?",
      [patch.status || null, patch.driverLat || null, patch.driverLng || null, patch.etaMinutes || null, id]
    );
    return this.findById(id);
  }
}

