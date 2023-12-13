const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat_app', { useNewUrlParser: true, useUnifiedTopology: true , family: 4});

// Define a User model
const User = mongoose.model('User', new mongoose.Schema({
 username: String,
 password: String
}));

// Initialize Express and Socket.IO
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to parse JSON bodies
app.use(express.json());

// Register route
app.post('/register', async (req, res) => {
 console.log(req.body);
 const user = new User({
  username: req.body.username,
  password: req.body.password,
 });
 await user.save();
 res.sendStatus(201);
});

// Login route
app.post('/login', async (req, res) => {
 const user = await User.findOne({ username: req.body.username });
 if (user && user.password === req.body.password) {
  const token = jwt.sign({ _id: user._id }, 'secret');
  res.json({ token });
 } else {
  res.sendStatus(401);
 }
});

// Socket.IO connection event
io.on('connection', (socket) => {
 console.log('a user connected');

 // Chat message event
 socket.on('chat message', (msg) => {
  io.emit('chat message', msg);
 });

 // Disconnect event
 socket.on('disconnect', () => {
  console.log('user disconnected');
 });
});

server.listen(3000, () => {
 console.log('listening on *:3000');
});
