// Backend entry point for Render deployment
import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { emailTemplates } from "./lib/emailService.js";
import grantRoutes from "./api/grants.js";

// Compatibility fix: the sign-in route currently calls adminUserSignedIn,
// while the email service exposes adminUserLogin. Create the expected alias
// before the auth route module is evaluated.
const templates = emailTemplates as typeof emailTemplates & {
  adminUserSignedIn: typeof emailTemplates.adminUserLogin;
};
templates.adminUserSignedIn = emailTemplates.adminUserLogin;

// Load auth routes after the email-template compatibility alias is ready.
const { default: authRoutes } = await import("./api/auth.js");

const getEnv = (key: string): string => {
  return (process.env as Record<string, string | undefined>)[key] || "";
};

const app: Express = express();

// Middleware
app.use(
  cors({
    origin: getEnv("FRONTEND_URL") || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = getEnv("MONGODB_URI") || "mongodb://localhost:27017/grant_portal";
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/grants", grantRoutes);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "API is running",
    timestamp: new Date(),
    environment: getEnv("NODE_ENV") || "development",
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    status: err.status || 500,
  });
});

// Start server
const PORT = parseInt(getEnv("PORT") || "5000", 10);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Health Check: http://localhost:${PORT}/api/health`);
});

export default app;
