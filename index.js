const { createServer } = require("http");
const { Server } = require("socket.io");


 //pls work
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (Socket) => {
  console.log("a user is connected with id : ", Socket.id);
  Socket.on("chat message", (msg) => {
    console.log(msg, Socket.id);
    io.emit("message", msg);
  });
});

httpServer.listen(3005);
