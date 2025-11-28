import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./config/database";
import { configurePassport } from "./config/passport";
import { authRoutes } from "./routes/auth";
import { taskRoutes } from "./routes/tasks";
import { userRoutes } from "./routes/users";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Configure Passport
configurePassport();

// Middleware
app.use(
  cors({
    // origin: process.env.CLIENT_URL || "http://localhost:8081",
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "🎮 Welcome to SoloLev API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      tasks: "/api/tasks",
      users: "/api/users",
      health: "/health",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "SoloLev API is running" });
});

app.listen(PORT, () => {
  console.log(`🎮 SoloLev server running on http://localhost:${PORT}`);
});
