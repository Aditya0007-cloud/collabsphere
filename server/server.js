import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { registerSocketHandlers } from './sockets/index.js';
import { registerIO } from './utils/emitters.js';

await connectDB();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.clientOrigins,
    credentials: true
  }
});

registerIO(io);
registerSocketHandlers(io);

httpServer.listen(env.port, () => {
  console.log(`CollabSphere API running on port ${env.port}`);
});
