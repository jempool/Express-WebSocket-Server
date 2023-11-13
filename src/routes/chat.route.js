import express from "express";
const router = express.Router();

import * as chatController from "../controllers/chat.controller.js";

/* GET History. */
router.get("/history", chatController.history);

export default router;
