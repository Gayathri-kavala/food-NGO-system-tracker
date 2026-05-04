import { WebSocketServer } from "ws";

const clients = new Set();

export function attachTrackingSocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws/tracking" });

  wss.on("connection", (socket) => {
    clients.add(socket);
    socket.send(JSON.stringify({ type: "connected", message: "Tracking socket connected" }));
    socket.on("close", () => clients.delete(socket));
  });
}

export function broadcastPickupUpdate(pickup) {
  const message = JSON.stringify({ type: "pickup_update", pickup });
  for (const client of clients) {
    if (client.readyState === 1) client.send(message);
  }
}

