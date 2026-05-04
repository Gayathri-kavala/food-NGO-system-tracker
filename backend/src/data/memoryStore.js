import { randomUUID } from "crypto";

const now = new Date();

export const memory = {
  donors: [
    { id: "donor-1", name: "Green Valley Mess", lat: 12.9716, lng: 77.5946, trustScore: 82 },
    { id: "donor-2", name: "North Campus Cafeteria", lat: 12.9345, lng: 77.6101, trustScore: 76 }
  ],
  ngos: [
    { id: "ngo-1", name: "Hope Meals Foundation", lat: 12.985, lng: 77.602, capacityMeals: 140, currentLoad: 40, trustScore: 91, phone: "+91-90000-10001" },
    { id: "ngo-2", name: "Little Stars Orphanage", lat: 12.927, lng: 77.626, capacityMeals: 80, currentLoad: 30, trustScore: 84, phone: "+91-90000-10002" },
    { id: "ngo-3", name: "Care Home Trust", lat: 12.955, lng: 77.57, capacityMeals: 120, currentLoad: 85, trustScore: 88, phone: "+91-90000-10003" },
    { id: "ngo-4", name: "Night Shelter Kitchen", lat: 13.005, lng: 77.615, capacityMeals: 200, currentLoad: 160, trustScore: 72, phone: "+91-90000-10004" }
  ],
  foodListings: [],
  pickups: [],
  notifications: [],
  decisionLogs: [
    { id: randomUUID(), createdAt: now.toISOString(), event: "system_bootstrap", payload: { message: "Demo memory store ready" } }
  ]
};

