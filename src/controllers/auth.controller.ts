import jwt from "jsonwebtoken";
import passport from "passport";
import * as dotenv from "dotenv";
dotenv.config();

import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../utils/constants.ts";
import { User } from "../interfaces/user.interface.ts";

export function login(req, res) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info.message || "Something went wrong",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.status(400).send(err);
      }
      const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      const refreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });
      return res.status(200).json({ user, accessToken, refreshToken });
    });
  })(req, res);
}

export function signup(req, res) {
  passport.authenticate(
    "local-signup",
    { session: false },
    (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info.message || "Something went wrong",
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.status(400).send(err);
        }
        const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
          expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        });
        const refreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
          expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        });
        return res.status(200).json({ user, accessToken, refreshToken });
      });
    }
  )(req, res);
}

export function refreshToken(req, res) {
  try {
    const { email, refreshToken } = req.body;
    const token = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    ) as jwt.JwtPayload;
    const isValid = token.user.email === email;
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid token, try login again" });
    }
    const user = { name: token.user.name, email: token.user.email };
    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    return res.status(200).json({ user, accessToken });
  } catch (error) {
    return false;
  }
}
