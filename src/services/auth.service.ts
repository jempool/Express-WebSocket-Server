import passport from "passport";
import * as passportLocal from "passport-local";
import * as passportJwt from "passport-jwt";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
dotenv.config();

import { getUserByEmail, createUser } from "./db.service.ts";
import { BCRYPT_SALT_ROUNDS } from "../utils/constants.ts";

export function initializeAuthStrategies() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email, password, done) {
        getUserByEmail(email)
          .then((user) => {
            if (!user || !bcrypt.compareSync(password, user.password)) {
              return done(null, false, {
                message: "Incorrect email or password.",
              });
            }
            return done(null, user.toObject(), {
              message: "User logged Successfully",
            });
          })
          .catch((err) => {
            console.error(err);
            done(err);
          });
      }
    )
  );

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        getUserByEmail(email)
          .then((user) => {
            if (user) {
              return done(null, false, {
                message: `The email ${email} is already associated with an account`,
              });
            }
            const salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS);
            const hash = bcrypt.hashSync(password, salt);
            createUser({ name: req.body.name, email, password: hash }).then(
              (user) => {
                return done(null, user, {
                  message: "User created Successfully",
                });
              }
            );
          })
          .catch((err) => {
            console.error(err);
            done(err);
          });
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      function (jwt_payload, done) {
        getUserByEmail(jwt_payload.user.email)
          .then((user) => {
            return done(null, user.toObject(), "User created Successfully");
          })
          .catch((err) => {
            console.error(err);
            done(err);
          });
      }
    )
  );
}
