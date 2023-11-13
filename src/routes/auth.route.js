import express from "express";
const router = express.Router();

import * as authController from "../controllers/auth.controller.js";

/* POST Login. */
router.post("/login", authController.login);

/* POST SignUp. */
router.post("/signup", authController.signup);

/* POST Verify refresh token. */
router.post("/refresh", authController.refreshToken);

export default router;
