import { getPool } from "../config/db.js";
import { BaseRepository } from "./baseRepository.js";

export class NgoRepository extends BaseRepository {
  constructor() {
    super("ngos");
  }

  async list() {
    if (!this.useMySql) return this.memory.ngos;
    const [rows] = await getPool().query("SELECT id, name, lat, lng, capacity_meals AS capacityMeals, current_load AS currentLoad, trust_score AS trustScore, phone FROM ngos");
    return rows;
  }

  async findById(id) {
    const ngos = await this.list();
    return ngos.find((ngo) => ngo.id === id);
  }

  async updateLoad(id, delta) {
    if (!this.useMySql) {
      const ngo = this.memory.ngos.find((item) => item.id === id);
      if (ngo) ngo.currentLoad = Math.max(0, ngo.currentLoad + delta);
      return ngo;
    }
    await getPool().execute("UPDATE ngos SET current_load = GREATEST(0, current_load + ?) WHERE id = ?", [delta, id]);
  }
}

