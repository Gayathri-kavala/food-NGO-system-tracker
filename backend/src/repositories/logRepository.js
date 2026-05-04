import { randomUUID } from "crypto";
import { getPool } from "../config/db.js";
import { BaseRepository } from "./baseRepository.js";

export class LogRepository extends BaseRepository {
  constructor() {
    super("decision_logs");
  }

  async create(event, payload) {
    const record = { id: randomUUID(), createdAt: new Date().toISOString(), event, payload };
    if (!this.useMySql) {
      this.memory.decisionLogs.push(record);
      return record;
    }
    await getPool().execute("INSERT INTO decision_logs (id, event, payload, created_at) VALUES (?, ?, ?, ?)", [
      record.id,
      event,
      JSON.stringify(payload),
      record.createdAt
    ]);
    return record;
  }

  async list() {
    if (!this.useMySql) return [...this.memory.decisionLogs].reverse().slice(0, 100);
    const [rows] = await getPool().query("SELECT * FROM decision_logs ORDER BY created_at DESC LIMIT 100");
    return rows;
  }
}

