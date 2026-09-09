const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");

// ==========================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ==========================================

dotenv.config();

// ==========================================
// CLOUDINARY CONFIG
// ==========================================

require("./config/cloudinary");

// ==========================================
// ROUTES
// ==========================================

const userRoutes = require("./routes/UserRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const newMessage = await Message.create({ senderId, receiverId, text });

      const receiverSocketId = onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
      }

      socket.emit("receiveMessage", newMessage);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// ==========================================
// CHECK ENVIRONMENT VARIABLES
// ==========================================

console.log("MONGO_URL:", process.env.MONGO_URL ? "Loaded" : "Not Loaded");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");
console.log("CLOUD_NAME:", process.env.CLOUD_NAME ? "Loaded" : "Not Loaded");
console.log("API_KEY:", process.env.API_KEY ? "Loaded" : "Not Loaded");
console.log("API_SECRET:", process.env.API_SECRET ? "Loaded" : "Not Loaded");

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use(userRoutes);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.send("DenyDev API Running");
});

// ==========================================
// MONGODB CONNECTION
// ==========================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.name);

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);

    process.exit(1);
  }
};

connectDB();
