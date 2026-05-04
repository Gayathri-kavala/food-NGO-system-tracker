import { config } from "../config/env.js";
import { memory } from "../data/memoryStore.js";

export class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.memory = memory;
    this.useMySql = config.useMySql;
  }
}

