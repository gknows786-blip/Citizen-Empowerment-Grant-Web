import { createServerFn } from "@tanstack/react-start";
import { User } from "../models/User.js";
import {
  generateToken,
  generateRefNumber,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  verifyToken,
} from "../lib/authUtils.js";
import { sendEmail, emailTemplates } from "../lib/emailService.js";

/**
 * DEMONSTRATION PROJECT
 *
 * These server functions are intended for the application's
 * independent demonstration environment.
 *
 * Do not use this demo to collect real government ID numbers,
 * payment information, or processing fees.
 */

const calculateAge = (dob: Date): number => {
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

/* -------------------------------------------------------------------------- */
/* SIGN UP                                                                    */
/* -------------------------------------------------------------------------- */

export const signupServerFn = createServerFn({
  method: "POST",
}).handler(
  async ({
    data,
  }: {
    data: {
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
    };
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
          error: "Email already registered",
        };
      }

      const dob = new Date(dateOfBirth);

      if (Number.isNaN(dob.getTime())) {
        return {
          success: false,
          error: "Invalid date of birth",
        };
      }

      const age = calculateAge(dob);

      if (age < 18) {
        return {
          success: false,
          error: "Must be 18 years or older",
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

        // Deliberately not collecting/storing a real government ID
        // in this demonstration application.
        personalIdNumber: undefined,

        refNumber,
        emailVerified: false,
      });

      await user.save();

      const token = generateToken(user._id.toString(), user.email);

      try {
        const { subject, html } = emailTemplates.signupConfirmation(firstName, refNumber);

        await sendEmail(email, subject, html);
      } catch (emailError) {
        console.error("Confirmation email error:", emailError);
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
    } catch (error) {
      console.error("Signup error:", error);

      return {
        success: false,
        error: "Registration failed",
      };
    }
  },
);

/* -------------------------------------------------------------------------- */
/* SIGN IN                                                                    */
/* -------------------------------------------------------------------------- */

export const signinServerFn = createServerFn({
  method: "POST",
}).handler(
  async ({
    data,
  }: {
    data: {
      email: string;
      password: string;
    };
  }) => {
    try {
      const { email, password } = data;

      if (!email || !password) {
        return {
          success: false,
          error: "Email and password required",
        };
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      const token = generateToken(user._id.toString(), user.email);

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
    } catch (error) {
      console.error("Signin error:", error);

      return {
        success: false,
        error: "Login failed",
      };
    }
  },
);

/* -------------------------------------------------------------------------- */
/* FORGOT PASSWORD                                                            */
/* -------------------------------------------------------------------------- */

export const forgotPasswordServerFn = createServerFn({
  method: "POST",
}).handler(
  async ({
    data,
  }: {
    data: {
      email: string;
    };
  }) => {
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

      const appUrl = process.env.APP_URL || "http://localhost:3000";

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
  },
);

/* -------------------------------------------------------------------------- */
/* RESET PASSWORD                                                             */
/* -------------------------------------------------------------------------- */

export const resetPasswordServerFn = createServerFn({
  method: "POST",
}).handler(
  async ({
    data,
  }: {
    data: {
      token: string;
      newPassword: string;
    };
  }) => {
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
  },
);

/* -------------------------------------------------------------------------- */
/* GET USER PROFILE                                                           */
/* -------------------------------------------------------------------------- */

export const getUserProfileServerFn = createServerFn({
  method: "GET",
}).handler(async ({ data }: { data: string }) => {
  try {
    const token = data;

    if (!token) {
      return {
        success: false,
        error: "No token provided",
      };
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        success: false,
        error: "Invalid token",
      };
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
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

    return {
      success: false,
      error: "Failed to get profile",
    };
  }
});

/* -------------------------------------------------------------------------- */
/* DEMO PROGRAM PACKAGES                                                      */
/* -------------------------------------------------------------------------- */

export const getGrantPackagesServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  /**
   * Demonstration-only package information.
   *
   * No real grant or payment transaction is performed.
   */
  const packages = [
    {
      name: "Basic",
      grantAmount: 10000,
      feeRequired: 0,
    },
    {
      name: "Silver",
      grantAmount: 20000,
      feeRequired: 0,
    },
    {
      name: "Gold",
      grantAmount: 50000,
      feeRequired: 0,
    },
    {
      name: "Platinum",
      grantAmount: 100000,
      feeRequired: 0,
    },
    {
      name: "Diamond",
      grantAmount: 200000,
      feeRequired: 0,
    },
  ];

  return {
    success: true,
    packages,
  };
});

/* -------------------------------------------------------------------------- */
/* SELECT PACKAGE                                                             */
/* -------------------------------------------------------------------------- */

export const selectPackageServerFn = createServerFn({
  method: "POST",
}).handler(
  async ({
    data,
  }: {
    data: {
      token: string;
      packageName: string;
    };
  }) => {
    try {
      const { token, packageName } = data;

      if (!token) {
        return {
          success: false,
          error: "No token provided",
        };
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return {
          success: false,
          error: "Invalid token",
        };
      }

      const packages = {
        Basic: 10000,
        Silver: 20000,
        Gold: 50000,
        Platinum: 100000,
        Diamond: 200000,
      };

      if (!packageName || !(packageName in packages)) {
        return {
          success: false,
          error: "Invalid package name",
        };
      }

      const user = await User.findById(decoded.userId);

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      const grantAmount = packages[packageName as keyof typeof packages];

      user.selectedPackage = packageName as any;
      user.grantAmount = grantAmount;

      // No processing fee is charged by this demo.
      user.feeAmount = 0;

      await user.save();

      return {
        success: true,
        message: "Demo package selected successfully",
        data: {
          selectedPackage: user.selectedPackage,
          grantAmount: user.grantAmount,
          feeAmount: 0,
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
  },
);

/* -------------------------------------------------------------------------- */
/* CONFIRM DEMO PAYMENT                                                       */
/* -------------------------------------------------------------------------- */

export const confirmPaymentServerFn = createServerFn({
  method: "POST",
}).handler(
  async ({
    data,
  }: {
    data: {
      token: string;
      transactionId: string;
      receiptPath?: string;
    };
  }) => {
    try {
      const { token, transactionId } = data;

      if (!token) {
        return {
          success: false,
          error: "No token provided",
        };
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return {
          success: false,
          error: "Invalid token",
        };
      }

      if (!transactionId) {
        return {
          success: false,
          error: "Demo transaction reference required",
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
          error: "Please select a package first",
        };
      }

      /*
       * This is deliberately a demo status update.
       * No real payment is processed or collected.
       */
      user.paymentStatus = "paid";
      user.paymentReceipt = transactionId;

      await user.save();

      return {
        success: true,
        message: "Demo payment status recorded. No real payment was processed.",
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
        error: "Failed to update demo payment status",
      };
    }
  },
);

/* -------------------------------------------------------------------------- */
/* DASHBOARD                                                                  */
/* -------------------------------------------------------------------------- */

export const getDashboardDataServerFn = createServerFn({
  method: "GET",
}).handler(async ({ data }: { data: string }) => {
  try {
    const token = data;

    if (!token) {
      return {
        success: false,
        error: "No token provided",
      };
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        success: false,
        error: "Invalid token",
      };
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
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
        },
      },
    };
  } catch (error) {
    console.error("Dashboard error:", error);

    return {
      success: false,
      error: "Failed to fetch dashboard",
    };
  }
});
