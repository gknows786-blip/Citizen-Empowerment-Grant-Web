import { createServerFn } from "@tanstack/react-start";
import { User } from "../models/User.js";
import {
  generateToken,
  generateRefNumber,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  verifyToken,
} from "../lib/authUtils.js";
import { sendEmail, sendAdminNotification, emailTemplates } from "../lib/emailService.js";

const getEnv = (key: string): string => {
  return (process.env as Record<string, string | undefined>)[key] || "";
};

const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Grant packages config
const grantPackagesList = [
  { name: "Basic", grantAmount: 10000, feeRequired: 100 },
  { name: "Silver", grantAmount: 20000, feeRequired: 200 },
  { name: "Gold", grantAmount: 50000, feeRequired: 500 },
  { name: "Platinum", grantAmount: 100000, feeRequired: 1000 },
  { name: "Diamond", grantAmount: 200000, feeRequired: 2000 },
];

/* -------------------------------------------------------------------------- */
/* SIGN UP                                                                    */
/* -------------------------------------------------------------------------- */

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  occupation: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  personalIdNumber?: string | undefined;
}

export const signupServerFn = createServerFn({ method: "POST" })
  .validator((data: SignupInput) => data)
  .handler(async ({ data }) => {
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
      } = data;

      if (!firstName || !lastName || !email || !password || !phone) {
        return {
          success: false,
          error: "Missing required fields",
        };
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          success: false,
          error: "Email is already registered. Please sign in instead.",
        };
      }

      const dob = new Date(dateOfBirth);
      if (Number.isNaN(dob.getTime())) {
        return {
          success: false,
          error: "Invalid date of birth provided.",
        };
      }

      const age = calculateAge(dob);
      if (age < 18) {
        return {
          success: false,
          error: "Applicant must be 18 years or older.",
        };
      }

      const refNumber = generateRefNumber();

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
        refNumber,
        emailVerified: false,
      });

      await user.save();

      const token = generateToken(user._id.toString(), user.email);

      // Send confirmation email to applicant
      try {
        const { subject, html } = emailTemplates.signupConfirmation(firstName, refNumber);
        await sendEmail(email, subject, html);
      } catch (emailError) {
        console.error("Confirmation email error:", emailError);
      }

      // Send Admin Notification to Portal Owner
      try {
        const adminNotice = emailTemplates.adminNewUserRegistered({
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
      } catch (adminErr) {
        console.error("Admin registration notification error:", adminErr);
      }

      return {
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          refNumber: user.refNumber,
        },
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.message || "Registration failed. Please try again.",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* SIGN IN                                                                    */
/* -------------------------------------------------------------------------- */

export interface SigninInput {
  email: string;
  password: string;
}

export const signinServerFn = createServerFn({ method: "POST" })
  .validator((data: SigninInput) => data)
  .handler(async ({ data }) => {
    try {
      const { email, password } = data;

      if (!email || !password) {
        return {
          success: false,
          error: "Email and password are required.",
        };
      }

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return {
          success: false,
          error: "Invalid email or password.",
        };
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: "Invalid email or password.",
        };
      }

      const token = generateToken(user._id.toString(), user.email);

      // Send Admin Notification on User Sign-in
      try {
        const adminNotice = emailTemplates.adminUserSignedIn({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          refNumber: user.refNumber,
        });
        await sendAdminNotification(adminNotice.subject, adminNotice.html);
      } catch (adminErr) {
        console.error("Admin signin notification error:", adminErr);
      }

      return {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          refNumber: user.refNumber,
        },
      };
    } catch (error: any) {
      console.error("Signin error:", error);
      return {
        success: false,
        error: error.message || "Login failed. Please try again.",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* FORGOT PASSWORD                                                            */
/* -------------------------------------------------------------------------- */

export const forgotPasswordServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { email } = data;

      if (!email) {
        return {
          success: false,
          error: "Email required",
        };
      }

      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: true,
          message: "If the email exists, a password reset link has been sent",
        };
      }

      const resetToken = generatePasswordResetToken(user._id.toString());
      const appUrl = getEnv("APP_URL") || "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

      const { subject, html } = emailTemplates.passwordReset(resetUrl);
      await sendEmail(email, subject, html);

      return {
        success: true,
        message: "Password reset link sent to your email",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        error: "Failed to send reset email",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* RESET PASSWORD                                                             */
/* -------------------------------------------------------------------------- */

export const resetPasswordServerFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; newPassword: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { token, newPassword } = data;

      if (!token || !newPassword) {
        return {
          success: false,
          error: "Token and new password required",
        };
      }

      if (newPassword.length < 8) {
        return {
          success: false,
          error: "Password must be at least 8 characters",
        };
      }

      const decoded = verifyPasswordResetToken(token);
      if (!decoded) {
        return {
          success: false,
          error: "Invalid or expired token",
        };
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      user.password = newPassword;
      await user.save();

      return {
        success: true,
        message: "Password reset successful",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        error: "Failed to reset password",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* GET USER PROFILE / DASHBOARD                                               */
/* -------------------------------------------------------------------------- */

export const getDashboardDataServerFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { token } = data;

      if (!token) {
        return {
          success: false,
          error: "No authorization token provided",
        };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return {
          success: false,
          error: "Invalid or expired session. Please login again.",
        };
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return {
          success: false,
          error: "User account not found",
        };
      }

      return {
        success: true,
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          refNumber: user.refNumber,
          paymentStatus: user.paymentStatus || "pending",
          selectedPackage: user.selectedPackage || null,
          grantAmount: user.grantAmount || null,
          feeAmount: user.feeAmount || null,
          profile: {
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            country: user.country,
            dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] || "" : "",
            gender: user.gender,
            occupation: user.occupation,
            maritalStatus: user.maritalStatus,
            personalIdNumber: user.personalIdNumber || null,
          },
        },
      };
    } catch (error) {
      console.error("Dashboard data error:", error);
      return {
        success: false,
        error: "Failed to fetch dashboard data",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* GRANT PACKAGES                                                             */
/* -------------------------------------------------------------------------- */

export const getGrantPackagesServerFn = createServerFn({ method: "GET" }).handler(async () => {
  return {
    success: true,
    packages: grantPackagesList,
  };
});

/* -------------------------------------------------------------------------- */
/* SELECT PACKAGE                                                             */
/* -------------------------------------------------------------------------- */

export const selectPackageServerFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; packageName: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { token, packageName } = data;

      if (!token) {
        return {
          success: false,
          error: "No authorization token provided",
        };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return {
          success: false,
          error: "Invalid session. Please login again.",
        };
      }

      const foundPkg = grantPackagesList.find((p) => p.name === packageName);
      if (!foundPkg) {
        return {
          success: false,
          error: "Invalid package selected.",
        };
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return {
          success: false,
          error: "User account not found",
        };
      }

      user.selectedPackage = packageName as any;
      user.grantAmount = foundPkg.grantAmount;
      user.feeAmount = foundPkg.feeRequired;
      user.paymentStatus = "pending";

      await user.save();

      // Send email to applicant
      try {
        const { subject, html } = emailTemplates.packageSelectionEmail(
          user.firstName,
          user.refNumber,
          foundPkg.grantAmount,
          foundPkg.feeRequired,
        );
        await sendEmail(user.email, subject, html);
      } catch (emailErr) {
        console.error("Package selection email error:", emailErr);
      }

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
      return {
        success: false,
        error: "Failed to select package",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* CONFIRM PAYMENT                                                            */
/* -------------------------------------------------------------------------- */

export const confirmPaymentServerFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; transactionId: string; receiptPath?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const { token, transactionId, receiptPath } = data;

      if (!token) {
        return {
          success: false,
          error: "No authorization token provided",
        };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return {
          success: false,
          error: "Invalid session token",
        };
      }

      if (!transactionId) {
        return {
          success: false,
          error: "Transaction ID or confirmation code is required",
        };
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      if (!user.grantAmount) {
        return {
          success: false,
          error: "Please select a grant package first",
        };
      }

      user.paymentStatus = "paid";
      user.paymentReceipt = receiptPath || transactionId;

      await user.save();

      // Send confirmation email
      try {
        const { subject, html } = emailTemplates.paymentConfirmation(
          user.firstName,
          user.refNumber,
          user.grantAmount,
        );
        await sendEmail(user.email, subject, html);
      } catch (err) {
        console.error("Payment confirmation email error:", err);
      }

      return {
        success: true,
        message: "Payment confirmation submitted successfully! Your grant status has been updated.",
        data: {
          paymentStatus: user.paymentStatus,
          refNumber: user.refNumber,
          grantAmount: user.grantAmount,
        },
      };
    } catch (error) {
      console.error("Confirm payment error:", error);
      return {
        success: false,
        error: "Failed to submit payment confirmation",
      };
    }
  });
