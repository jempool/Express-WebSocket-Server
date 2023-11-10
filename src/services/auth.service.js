import passport from "passport";
import * as passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import passportJWT from "passport-jwt";
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
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
      .then(user => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return done(null, false, "Incorrect email or password.");
        }
        return done(null, { email }, "User created Successfully");
      })
      .catch(err => done(err));
  }
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
},
  function (jwtPayload, done) {
    // to-do: implement refresh token
    const user = {};
    return done(null, user);
  }
));

passport.use("local-signup", new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},
  function (email, password, done) {
    getUserByEmail(email)
      .then(user => {
        if (user) {
          return done(null, false, `The email ${email} is already associated with an account`);
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        createUser({ email, password: hash })
          .then(() => {
            return done(null, { email }, "User created Successfully");
          });
      })
      .catch(err => done(err));
  }
));
