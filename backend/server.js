const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.router');
const hrRoutes = require('./routes/hr.router');
const taskRoutes = require('./routes/task.route');
const teamLeadRoutes = require('./routes/teamlead.route');
const chatRoutes = require('./routes/chat.route');
const internRoutes = require('./routes/intern.route');
const fileRoutes = require('./routes/file.route');
const timeRoutes = require('./routes/time.route');
const attendanceRoutes = require("./routes/attendence.route");
const meetingRoutes = require("./routes/meeting.route"); // ✅ Added meeting routes

// Controllers
const initChat = require('./controllers/chat.controller');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middlewares
app.use(express.json());
app.use(cors());

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the virtual office server' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teamlead', teamLeadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/intern', internRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/time', timeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/meetings", meetingRoutes); // ✅ Meeting APIs

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------- SOCKET.IO ------------------- //

// ✅ Initialize Chat Socket
initChat(io);

// WebRTC Signaling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ meetingCode, userName }) => {
    socket.join(meetingCode);
    socket.to(meetingCode).emit("user-joined", { userName, id: socket.id });
  });

  socket.on("offer", (data) => {
    socket.to(data.to).emit("offer", { from: socket.id, offer: data.offer });
  });

  socket.on("answer", (data) => {
    socket.to(data.to).emit("answer", { from: socket.id, answer: data.answer });
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.to).emit("ice-candidate", { from: socket.id, candidate: data.candidate });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ------------------- DB CONNECTION ------------------- //
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
