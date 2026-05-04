import http from "http";
import { config } from "./config/env.js";
import { createApp } from "./app.js";
import { attachTrackingSocket } from "./tracking/trackingSocket.js";

const app = createApp();
const server = http.createServer(app);

attachTrackingSocket(server);

server.listen(config.port, () => {
  console.log(`AI Mess Food Redistribution API running on http://localhost:${config.port}`);
});

