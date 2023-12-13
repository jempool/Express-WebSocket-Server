import express from "express";
const router = express.Router();

import * as topicController from "../controllers/topic.controller.ts";

/* GET Topics. */
router.get("/today", topicController.getTodaysTopic);

export default router;
