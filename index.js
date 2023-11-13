import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import * as dbService from "./src/services/db.service.js"; // move

import { PORT, DATABASE_URL, DATABASE_NAME } from "./src/utils/constants.js";
import "./src/services/auth.service.js";
import authRouter from "./src/routes/auth.route.js";
import chatRouter from "./src/routes/chat.route.js";

// =================================================================================
// API Server  =====================================================================
// =================================================================================

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/chat", passport.authenticate("jwt", { session: false }), chatRouter);


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

io.on("connection", (socket) => {
  console.log(`${new Date()} - New connection ${socket.id}`);

  // Listening for chat event
  socket.on("chat", function (data) {
    dbService.addMessage(data); // move
    io.sockets.emit("chat", data);
  });

  // Listening for typing event
  socket.on("typing", function (data) {
    io.sockets.emit("typing", data);
    socket.broadcast.emit("typing", data);
  });
});


const start = async () => {
  try {
    await mongoose.connect(`${DATABASE_URL}/${DATABASE_NAME}`);
    httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
