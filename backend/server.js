const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth.router');
const hrRoutes = require('./routes/hr.router');
const taskRoutes = require('./routes/task.route');
const initChat = require('./controllers/chat.controller');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the virtual office server' });
});

app.use('/api/auth', authRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/tasks', taskRoutes);

// Initialize Chat Socket
initChat(io);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
