const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http"); // ✅ import http
const socketIo = require("socket.io"); // ✅ import socket.io
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ✅ server banaya
// const io = socketIo(server, { // ✅ socket.io attach kiya
  // cors: {
  //    origin: ["http://localhost:3000", "http://localhost:5173"],  // tumhara frontend URL
  //   methods: ["GET", "POST"],
  //   credentials: true
  // }
//   const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });
//    transports: ['websocket', 'polling']
// });

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});




// middleware
// app.use(cors());
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"]
}));


app.use(express.json());

// ✅ socket.io instance ko app mein store karo
app.set('socketio', io);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/hospitals", hospitalRoutes);

app.get("/", (req, res) => {
  res.send("Ambulance Booking API Running");
});

// ✅ socket connection
io.on('connection', (socket) => {
  console.log('🚀 Driver connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('❌ Driver disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// ✅ app.listen ki jagah server.listen karo
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});