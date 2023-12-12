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
import "./services/auth.service.js";
import authRouter from "./routes/auth.route.ts";
import chatRouter from "./routes/chat.route.ts";

// =================================================================================
// API  ============================================================================
// =================================================================================

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/chat", passport.authenticate("jwt", { session: false }), chatRouter);

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
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
