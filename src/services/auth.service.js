import passport from "passport";
import * as passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import * as passportJwt from "passport-jwt";
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
import bcrypt from "bcrypt";
const saltRounds = 10;
import * as dotenv from "dotenv";
dotenv.config();

import { getUserByEmail, createUser } from "./db.service.js";


passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},
  function (email, password, done) {
    getUserByEmail(email)
      .then((user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return done(null, false, "Incorrect email or password.");
        }
        return done(null, user.toResponseObject(), "User created Successfully");
      })
      .catch((err) => {
        console.error(err);
        done(err);
      });
  }
));

passport.use("local-signup", new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
},
  function (req, email, password, done) {
    getUserByEmail(email)
      .then((user) => {
        if (user) {
          return done(null, false, `The email ${email} is already associated with an account`);
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        createUser({ name: req.body.name, email, password: hash })
          .then((user) => {
            return done(null, user.toResponseObject(), "User created Successfully");
          });
      })
      .catch((err) => {
        console.error(err);
        done(err);
      });
  }
));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, function (jwt_payload, done) {
  getUserByEmail(jwt_payload.user.email)
    .then((user) => {
      return done(null, user.toResponseObject(), "User created Successfully");
    })
    .catch((err) => {
      console.error(err);
      done(err);
    });
}));
