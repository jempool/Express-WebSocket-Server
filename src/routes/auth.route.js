import express from "express";
const router = express.Router();

import * as authControler from "../controllers/auth.controller.js";

/* POST Login. */
router.post("/login", authControler.login);

/* POST SignUp. */
router.post("/signup", authControler.signup);

export default router;
