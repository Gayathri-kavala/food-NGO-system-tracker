import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  useMySql: String(process.env.USE_MYSQL || "false").toLowerCase() === "true",
  mysql: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ai_mess_food"
  },
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  mlPredictScript: process.env.ML_PREDICT_SCRIPT || "../ml-model/predict_expiry.py"
};

