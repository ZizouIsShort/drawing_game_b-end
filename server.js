import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";

import { db } from "./db/index.js";
import { strokes } from "./db/schema.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.post("/create", (req, res) => {
  const user_id = req.userId;
  console.log(user_id);
  const room_id = crypto.randomUUID();
  console.log(room_id);
  res.send(room_id);
});

io.on("connection", function (socket) {
  socket.on("join_room", async function (room) {
    socket.join(room);
    console.log(`socket ${socket.id} joined room ${room}`);
    const history = await db.execute(
      sql`SELECT prev_x, prev_y, x, y, color, width FROM strokes WHERE room_id = ${room} ORDER BY created_at`,
    );
    console.log("sending history:", history)
    socket.emit("drawing_history", history)
  });
  socket.on("chat message", async function ({ room, msg }) {
    console.log(msg, socket.id);
    socket.to(room).emit("message", msg);
    const mhistory = await db.execute(
      sql`INSERT INTO messages (room_id, message) VALUES (${room}, ${msg})`
    )
    console.log(mhistory)
  });
  socket.on("draw", async ({ room, art }) => {
    console.log("DRAW EVENT:", art);
    socket.to(room).emit("draw", art);
    const sent = await db.insert(strokes).values({
      roomId: room,
      prevX: art.prevX,
      prevY: art.prevY,
      x: art.x,
      y: art.y,
      color: art.color,
      width: art.width,
    });
  });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

httpServer.listen(3005, () => {
  console.log("Server listening on port 3005");
});
