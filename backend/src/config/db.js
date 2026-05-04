import mysql from "mysql2/promise";
import { config } from "./env.js";

let pool;

export function getPool() {
  if (!config.useMySql) return null;
  if (!pool) {
    pool = mysql.createPool({
      ...config.mysql,
      waitForConnections: true,
      connectionLimit: 10
    });
  }
  return pool;
}

