import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import * as WebSockets from "./src/webSockets/webSockets.js";
import { PORT, DATABASE_URL, DATABASE_NAME } from "./src/utils/constants.js";
import "./src/services/auth.service.js";
import authRouter from "./src/routes/auth.route.js";
import chatRouter from "./src/routes/chat.route.js";


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
    httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
