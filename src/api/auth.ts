import { Router, Request, Response } from "express";
import { User } from "../models/User.js";
import {
  generateToken,
  generateRefNumber,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  verifyToken,
} from "../lib/authUtils.js";
import { sendEmail, sendAdminNotification, emailTemplates } from "../lib/emailService.js";

const router = Router();

const getEnv = (key: string): string => {
  return (process.env as Record<string, string | undefined>)[key] || "";
};

// Helper to calculate age
const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Register (Sign Up)
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      occupation,
      address,
      city,
      state,
      zipCode,
      country,
      maritalStatus,
      personalIdNumber,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !phone) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    // Calculate age
    const dob = new Date(dateOfBirth);
    const age = calculateAge(dob);

    if (age < 18) {
      res.status(400).json({ error: "Must be 18 years or older" });
      return;
    }

    // Generate reference number
    const refNumber = generateRefNumber();

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth: dob,
      gender,
      occupation,
      age,
      address,
      city,
      state,
      zipCode,
      country,
      maritalStatus,
      personalIdNumber,
      refNumber,
      emailVerified: false,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    // Send confirmation email to user
    try {
      const { subject, html } = emailTemplates.welcome(firstName, refNumber);
      await sendEmail(email, subject, html);
    } catch (emailErr) {
      console.error("User email error:", emailErr);
    }

    // Send Admin Notification to platform owner
    try {
      const adminNotice = emailTemplates.adminNewUser({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dob,
        occupation,
        city,
        state,
        country,
        refNumber,
      });
      await sendAdminNotification(adminNotice.subject, adminNotice.html);
    } catch (adminEmailErr) {
      console.error("Admin notification error:", adminEmailErr);
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        refNumber: user.refNumber,
      },
    });
    return;
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Registration failed" });
    return;
  }
});

// Login (Sign In)
router.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    // Send sign-in confirmation to the user
    try {
      const signInTime = new Date().toUTCString();
      await sendEmail(
        user.email,
        `Sign-In Confirmation - Citizen-empowerment Grant Portal`,
        `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Sign-In Confirmation</title>
          </head>
          <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <div style="max-width:620px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
              <div style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:32px 24px;text-align:center;color:white;">
                <h1 style="margin:0;font-size:26px;">Citizen-empowerment Grant Portal</h1>
              </div>
              <div style="padding:30px 28px;">
                <h2 style="margin:0 0 12px;color:#1e293b;">Welcome back, ${user.firstName}! 👋</h2>
                <p style="font-size:15px;line-height:1.7;color:#475569;">
                  You have successfully signed in to your account.
                </p>
                <div style="margin:22px 0;padding:20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;line-height:2;font-size:14px;">
                  <strong>Name:</strong> ${user.firstName} ${user.lastName}<br/>
                  <strong>Email:</strong> ${user.email}<br/>
                  <strong>Reference:</strong> ${user.refNumber}<br/>
                  <strong>Signed in:</strong> ${signInTime}
                </div>
                <div style="padding:15px;background:#eff6ff;border-radius:10px;color:#1e40af;font-size:13px;line-height:1.6;">
                  This is an automated sign-in notification for the grant portal.
                  If you did not initiate this sign-in, please secure your account.
                </div>
              </div>
              <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:22px;text-align:center;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#64748b;">OFFICIAL GOVERNMENT SERVICE</p>
              </div>
            </div>
          </body>
          </html>
        `,
      );
    } catch (userEmailErr) {
      console.error("User signin email error:", userEmailErr);
    }

    // Send Admin Notification on User Sign-in
    try {
      const adminNotice = emailTemplates.adminUserSignedIn({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        refNumber: user.refNumber,
      });
      await sendAdminNotification(adminNotice.subject, adminNotice.html);
    } catch (adminEmailErr) {
      console.error("Admin signin notification error:", adminEmailErr);
    }  

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        refNumber: user.refNumber,
      },
    });
    return;
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Login failed" });
    return;
  }
});

// Forgot Password
router.post("/forgot-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.json({
        success: true,
        message: "If email exists, password reset link has been sent",
      });
      return;
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken(user._id.toString());
    const appUrl = getEnv("APP_URL") || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

    // Send password reset email
    const { subject, html } = emailTemplates.passwordReset(resetUrl);
    await sendEmail(email, subject, html);

    res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
    return;
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to send reset email" });
    return;
  }
});

// Reset Password
router.post("/reset-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ error: "Token and new password required" });
      return;
    }

    // Verify token
    const decoded = verifyPasswordResetToken(token);
    if (!decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
    return;
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
    return;
  }
});

// Get user profile (protected route)
router.get("/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        occupation: user.occupation,
        age: user.age,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        maritalStatus: user.maritalStatus,
        personalIdNumber: user.personalIdNumber,
        refNumber: user.refNumber,
        selectedPackage: user.selectedPackage,
        grantAmount: user.grantAmount,
        feeAmount: user.feeAmount,
        paymentStatus: user.paymentStatus,
        emailVerified: user.emailVerified,
      },
    });
    return;
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
    return;
  }
});

export default router;