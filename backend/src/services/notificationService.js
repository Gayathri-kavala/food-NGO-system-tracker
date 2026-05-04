import { randomUUID } from "crypto";
import { memory } from "../data/memoryStore.js";

export function notify(type, recipientId, message, payload = {}) {
  const notification = {
    id: randomUUID(),
    type,
    recipientId,
    message,
    payload,
    read: false,
    createdAt: new Date().toISOString()
  };
  memory.notifications.push(notification);
  return notification;
}

export function listNotifications() {
  return [...memory.notifications].reverse();
}

