const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`${new Date()} - New connection ${socket.id}`)

  // Listening for chat event
  socket.on('chat', function (data) {
    console.log('chat event trigged at server');
    console.log('need to notify all the clients about this event');
    io.sockets.emit('chat', data);
  });

  // Listening for typing event
  socket.on('typing', function (data) {
    console.log(`Server received ${data} is typing`);
    console.log('need to inform all the clients about this');
    io.sockets.emit('typing', data);
    socket.broadcast.emit('typing', data);
  });
});

httpServer.listen(3000);