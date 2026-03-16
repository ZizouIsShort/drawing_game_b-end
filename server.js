import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";

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
  socket.on("join_room", function (room) {
    socket.join(room);
    console.log(`socket ${socket.id} joined room ${room}`);
  });
  socket.on("chat message", function ({ room, msg }) {
    console.log(msg, socket.id);
    socket.to(room).emit("message", msg);
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
        width: art.width
    })
    console.log(sent)
  });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

httpServer.listen(3005, () => {
  console.log("Server listening on port 3005");
});