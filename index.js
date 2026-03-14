const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { createServer } = require("http");
const crypto = require("crypto");

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
  socket.on("draw", ({ room, art }) => {
    console.log("DRAW EVENT:", art);
    socket.to(room).emit("draw", art);
  });
});
//change test

app.get("/", (req, res) => {
  res.send("Server running");
});

httpServer.listen(3005, () => {
  console.log("Server listening on port 3005");
});
