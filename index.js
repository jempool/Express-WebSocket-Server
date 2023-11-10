import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

import "./src/services/auth.service.js";
import authRouter from "./src/routes/auth.route.js";

// =================================================================================
// API Server  =====================================================================
// =================================================================================

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);


// =================================================================================
// WebSockets  =====================================================================
// =================================================================================

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) return next(new Error("Authentication error"));
      socket.decoded = decoded;
      next();
    });
  }
  else {
    next(new Error("Authentication error"));
  }
})
  .on("connection", (socket) => {
    console.log(`${new Date()} - New connection ${socket.id}`);

    // Listening for chat event
    socket.on("chat", function (data) {
      io.sockets.emit("chat", data);
    });

    // Listening for typing event
    socket.on("typing", function (data) {
      io.sockets.emit("typing", data);
      socket.broadcast.emit("typing", data);
    });
  });

httpServer.listen(3000);
