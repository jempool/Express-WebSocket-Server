import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import * as WebSockets from "./webSockets/webSockets.ts";
import { PORT, DATABASE_URL, DATABASE_NAME } from "./utils/constants.ts";
import { initializeAuthStrategies } from "./services/auth.service.ts";
import authRouter from "./routes/auth.route.ts";
import chatRouter from "./routes/chat.route.ts";
import topicRouter from "./routes/topic.route.ts";

// =================================================================================
// API  ============================================================================
// =================================================================================

const app = express();
app.use(cors());
app.use(bodyParser.json());

initializeAuthStrategies();

app.use("/auth", authRouter);
app.use("/chat", passport.authenticate("jwt", { session: false }), chatRouter);
app.use(
  "/topics",
  passport.authenticate("jwt", { session: false }),
  topicRouter
);

// =================================================================================
// Server  =========================================================================
// =================================================================================

const httpServer = createServer(app);

// === WebSockets ===
WebSockets.socketIO(httpServer);

const start = async () => {
  try {
    await mongoose.connect(`${DATABASE_URL}/${DATABASE_NAME}`);
    httpServer.listen(PORT, () =>
      console.log(`Server started on port ${PORT}`)
    );

    // Add an event handler for the 'exit' event
    process.on("exit", () => {
      // Close the HTTP server
      httpServer.close(() => {
        console.log("HTTP server closed.");
      });

      // Close the MongoDB connection
      mongoose.connection.close();
      console.log("MongoDB connection closed.");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
