import express from "express";
import bodyParser from 'body-parser';
import { createServer } from "http";
import { Server } from "socket.io";
// import passport from 'passport';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import "./passport.js";
import auth from './routes/public/auth.js';
// import chat from './routes/private/chat.js';

// =================================================================================
// API Server  =====================================================================
// =================================================================================

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.use('/auth', auth);
// app.use('/chat', passport.authenticate('jwt', { session: false }), chat);


// =================================================================================
// WebSockets  =====================================================================
// =================================================================================

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, 'your_jwt_secret', function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  }
  else {
    next(new Error('Authentication error'));
  }
})
  .on("connection", (socket) => {
    console.log(`${new Date()} - New connection ${socket.id}`)

    // Listening for chat event
    socket.on('chat', function (data) {
      io.sockets.emit('chat', data);
    });

    // Listening for typing event
    socket.on('typing', function (data) {
      io.sockets.emit('typing', data);
      socket.broadcast.emit('typing', data);
    });
  });

httpServer.listen(3000);