import { Server } from "socket.io";

import * as dbService from "../services/db.service.ts";

export function socketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`${new Date()} - New connection ${socket.id}`);

    // Listening for chat event
    socket.on("chat", function (data) {
      dbService.addMessage(data);
      io.sockets.emit("chat", data);
    });

    // Listening for typing event
    socket.on("typing", function (data) {
      io.sockets.emit("typing", data);
      socket.broadcast.emit("typing", data);
    });
  });
}
