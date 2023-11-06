import express from "express";
import bodyParser from 'body-parser';
import { createServer } from "http";
import { Server } from "socket.io";
import { getCustomers, createCustomers } from "./database.js";
// ---------
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import expressSession from "express-session";
import passport from "passport";
import Auth0Strategy from "passport-auth0";

import dotenv from 'dotenv';
dotenv.config()

import authRouter from "./auth.js";

// ---------
const app = express();
const port = process.env.PORT || "3000";

app.use(bodyParser.json());

// Session Configuration
const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

// App Configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session));

// Passport Configuration
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Creating custom middleware with Express
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Router mounting
app.use("/", authRouter);
// ----------------------------------


app.get('/customers', getCustomers);
app.post('/customers', createCustomers);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`${new Date()} - New connection ${socket.id}`)

  // Listening for chat event
  socket.on('chat', function (data) {
    console.log('chat event trigged at server');
    console.log('need to notify all the clients about this event');
    io.sockets.emit('chat', data);
  });

  // Listening for typing event
  socket.on('typing', function (data) {
    console.log(`Server received ${data} is typing`);
    console.log('need to inform all the clients about this');
    io.sockets.emit('typing', data);
    socket.broadcast.emit('typing', data);
  });
});

httpServer.listen(port);