import { createServerFn } from "@tanstack/react-start/server";
import { User } from "../models/User.js";
import { generateToken, generateRefNumber, generatePasswordResetToken, verifyPasswordResetToken, verifyToken } from "../lib/authUtils.js";
import { sendEmail, emailTemplates } from "../lib/emailService.js";

// Calculate age helper
const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Signup Server Function
export const signupServerFn = createServerFn({ method: "POST" }).handler(
  async (body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    occupation: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    maritalStatus: string;
    personalIdNumber?: string;
  }) => {
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
      } = body;

      // Validation
      if (!firstName || !lastName || !email || !password || !phone) {
        return { error: "Missing required fields", success: false };
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { error: "Email already registered", success: false };
      }

      // Calculate age
      const dob = new Date(dateOfBirth);
      const age = calculateAge(dob);

      if (age < 18) {
        return { error: "Must be 18 years or older", success: false };
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

      // Send confirmation email
      const { subject, html } = emailTemplates.signupConfirmation(firstName, refNumber);
      await sendEmail(email, subject, html);

      return {
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
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { error: "Registration failed", success: false };
    }
  }
);

// Signin Server Function
export const signinServerFn = createServerFn({ method: "POST" }).handler(
  async (body: { email: string; password: string }) => {
    try {
      const { email, password } = body;

      if (!email || !password) {
        return { error: "Email and password required", success: false };
      }

      // Find user and include password field
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return { error: "Invalid credentials", success: false };
      }

      // Compare passwords
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return { error: "Invalid credentials", success: false };
      }

      // Generate token
      const token = generateToken(user._id.toString(), user.email);

      return {
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
      };
    } catch (error) {
      console.error("Signin error:", error);
      return { error: "Login failed", success: false };
    }
  }
);

// Forgot Password Server Function
export const forgotPasswordServerFn = createServerFn({ method: "POST" }).handler(
  async (body: { email: string }) => {
    try {
      const { email } = body;

      if (!email) {
        return { error: "Email required", success: false };
      }

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists (security best practice)
        return { success: true, message: "If email exists, password reset link has been sent" };
      }

      // Generate reset token
      const resetToken = generatePasswordResetToken(user._id.toString());
      const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

      // Send password reset email
      const { subject, html } = emailTemplates.passwordReset(resetUrl);
      await sendEmail(email, subject, html);

      return {
        success: true,
        message: "Password reset link sent to your email",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { error: "Failed to send reset email", success: false };
    }
  }
);

// Reset Password Server Function
export const resetPasswordServerFn = createServerFn({ method: "POST" }).handler(
  async (body: { token: string; newPassword: string }) => {
    try {
      const { token, newPassword } = body;

      if (!token || !newPassword) {
        return { error: "Token and new password required", success: false };
      }

      // Verify token
      const decoded = verifyPasswordResetToken(token);
      if (!decoded) {
        return { error: "Invalid or expired token", success: false };
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return { error: "User not found", success: false };
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return {
        success: true,
        message: "Password reset successful",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: "Failed to reset password", success: false };
    }
  }
);

// Get User Profile Server Function
export const getUserProfileServerFn = createServerFn({ method: "GET" }).handler(
  async (token: string) => {
    try {
      if (!token) {
        return { error: "No token provided", success: false };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { error: "Invalid token", success: false };
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return { error: "User not found", success: false };
      }

      return {
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
      };
    } catch (error) {
      console.error("Get profile error:", error);
      return { error: "Failed to get profile", success: false };
    }
  }
);

// Get Grant Packages Server Function
export const getGrantPackagesServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const grantPackages = {
      Basic: { grant: 10000, fee: 100 },
      Silver: { grant: 20000, fee: 200 },
      Gold: { grant: 50000, fee: 500 },
      Platinum: { grant: 100000, fee: 1000 },
      Diamond: { grant: 200000, fee: 2000 },
    };

    const packages = Object.entries(grantPackages).map(([name, amounts]) => ({
      name,
      grantAmount: amounts.grant,
      feeRequired: amounts.fee,
    }));

    return { success: true, packages };
  }
);

// Select Package Server Function
export const selectPackageServerFn = createServerFn({ method: "POST" }).handler(
  async (body: { token: string; packageName: string }) => {
    try {
      const { token, packageName } = body;

      const grantPackages = {
        Basic: { grant: 10000, fee: 100 },
        Silver: { grant: 20000, fee: 200 },
        Gold: { grant: 50000, fee: 500 },
        Platinum: { grant: 100000, fee: 1000 },
        Diamond: { grant: 200000, fee: 2000 },
      };

      if (!token) {
        return { error: "No token provided", success: false };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { error: "Invalid token", success: false };
      }

      if (!packageName || !(packageName in grantPackages)) {
        return { error: "Invalid package name", success: false };
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return { error: "User not found", success: false };
      }

      // Update user with selected package
      const packageData = grantPackages[packageName as keyof typeof grantPackages];
      user.selectedPackage = packageName as any;
      user.grantAmount = packageData.grant;
      user.feeAmount = packageData.fee;
      user.paymentStatus = "pending";
      await user.save();

      // Send email with payment instructions
      const { subject, html } = emailTemplates.packageSelectionEmail(
        user.firstName,
        user.refNumber,
        packageData.grant,
        packageData.fee
      );
      await sendEmail(user.email, subject, html);

      return {
        success: true,
        message: "Package selected successfully",
        data: {
          selectedPackage: user.selectedPackage,
          grantAmount: user.grantAmount,
          feeAmount: user.feeAmount,
          refNumber: user.refNumber,
        },
      };
    } catch (error) {
      console.error("Select package error:", error);
      return { error: "Failed to select package", success: false };
    }
  }
);

// Confirm Payment Server Function
export const confirmPaymentServerFn = createServerFn({ method: "POST" }).handler(
  async (body: { token: string; transactionId: string; receiptPath?: string }) => {
    try {
      const { token, transactionId, receiptPath } = body;

      if (!token) {
        return { error: "No token provided", success: false };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { error: "Invalid token", success: false };
      }

      if (!transactionId) {
        return { error: "Transaction ID required", success: false };
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return { error: "User not found", success: false };
      }

      if (!user.grantAmount || !user.feeAmount) {
        return { error: "Please select a package first", success: false };
      }

      // Update payment status
      user.paymentStatus = "paid";
      user.paymentReceipt = receiptPath || transactionId;
      await user.save();

      // Send payment confirmation email
      const { subject, html } = emailTemplates.paymentConfirmation(
        user.firstName,
        user.refNumber,
        user.grantAmount
      );
      await sendEmail(user.email, subject, html);

      return {
        success: true,
        message: "Payment confirmed! Your grant will be delivered within 24 hours.",
        data: {
          paymentStatus: user.paymentStatus,
          refNumber: user.refNumber,
          grantAmount: user.grantAmount,
        },
      };
    } catch (error) {
      console.error("Confirm payment error:", error);
      return { error: "Failed to confirm payment", success: false };
    }
  }
);

// Get Dashboard Data Server Function
export const getDashboardDataServerFn = createServerFn({ method: "GET" }).handler(
  async (token: string) => {
    try {
      if (!token) {
        return { error: "No token provided", success: false };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { error: "Invalid token", success: false };
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return { error: "User not found", success: false };
      }

      return {
        success: true,
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          refNumber: user.refNumber,
          paymentStatus: user.paymentStatus,
          selectedPackage: user.selectedPackage,
          grantAmount: user.grantAmount,
          feeAmount: user.feeAmount,
          profile: {
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            country: user.country,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            occupation: user.occupation,
            maritalStatus: user.maritalStatus,
            personalIdNumber: user.personalIdNumber,
          },
        },
      };
    } catch (error) {
      console.error("Dashboard error:", error);
      return { error: "Failed to fetch dashboard", success: false };
    }
  }
);
