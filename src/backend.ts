// Backend entry point for Render deployment
import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { emailTemplates, sendAdminNotification } from "./lib/emailService.js";
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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

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

// Footer contact form
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const firstName = String(req.body?.firstName || "").trim();
    const lastName = String(req.body?.lastName || "").trim();
    const email = String(req.body?.email || "").trim();
    const phone = String(req.body?.phone || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "First name, last name, email, and message are required.",
      });
    }

    const emailHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:0 auto;color:#1e293b;">
        <div style="background:#1e3a5f;color:#fff;padding:24px;border-radius:10px 10px 0 0;">
          <h2 style="margin:0;font-size:21px;">New Contact Message</h2>
          <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">Footer contact form submission</p>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:0;padding:24px;border-radius:0 0 10px 10px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:600;width:120px;">Name</td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:600;">Email</td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:600;">Phone</td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(phone || "Not provided")}</td></tr>
          </table>
          <h3 style="margin:24px 0 10px;color:#1e3a5f;">Message</h3>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</div>
          <p style="margin:20px 0 0;color:#64748b;font-size:12px;">Received: ${new Date().toUTCString()}</p>
        </div>
      </div>
    `;

    const sent = await sendAdminNotification(
      `New Contact Message — ${firstName} ${lastName}`,
      emailHtml,
    );

    if (!sent) {
      return res.status(500).json({
        success: false,
        error: "Unable to send your message right now.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
});

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
