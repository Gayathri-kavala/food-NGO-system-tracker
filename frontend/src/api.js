import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
});

export async function uploadFood(formData) {
  const { data } = await api.post("/api/food/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function assignPickup(payload) {
  const { data } = await api.post("/api/pickups/assign", payload);
  return data;
}

export async function getAdminSummary() {
  const { data } = await api.get("/api/admin/summary");
  return data;
}

export async function getTrustScores() {
  const { data } = await api.get("/api/trust");
  return data;
}

