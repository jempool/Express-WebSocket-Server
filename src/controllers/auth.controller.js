import jwt from "jsonwebtoken";
import passport from "passport";
import * as dotenv from "dotenv";
dotenv.config();

export function login(req, res) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info || "Something went wrong",
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ email: user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      return res.json({ user, token });
    });
  })(req, res);
}

export function signup(req, res) {
  passport.authenticate("local-signup", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info || "Something went wrong"
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ email: user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      return res.json({ user, token });
    });
  }
  )(req, res);
}


