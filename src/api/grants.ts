import { Router, Request, Response } from "express";
import { User } from "../models/User.js";
import { sendEmail, sendAdminNotification, emailTemplates } from "../lib/emailService.js";
import { demoPackageEmail, demoAdminPackageEmail } from "../lib/demoPackageEmail.js";
import { verifyToken } from "../lib/authUtils.js";

const router = Router();

const grantPackages = {
  Basic: { grant: 10000, fee: 100 },
  Silver: { grant: 20000, fee: 200 },
  Gold: { grant: 50000, fee: 500 },
  Platinum: { grant: 100000, fee: 1000 },
  Diamond: { grant: 200000, fee: 2000 },
};

const sendNotificationSafely = async (
  label: string,
  send: () => Promise<boolean>,
): Promise<boolean> => {
  try {
    return await Promise.race([
      send(),
      new Promise<boolean>((resolve) =>
        setTimeout(() => {
          console.error(`${label} notification timed out after 15 seconds`);
          resolve(false);
        }, 15000),
      ),
    ]);
  } catch (error) {
    console.error(`${label} notification failed:`, error);
    return false;
  }
};

router.get("/packages", (_req: Request, res: Response) => {
  const packages = Object.entries(grantPackages).map(([name, amounts]) => ({
    name,
    grantAmount: amounts.grant,
    feeRequired: amounts.fee,
  }));

  res.json({ success: true, packages });
});

router.post("/select-package", async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = verifyToken(authHeader.substring(7));
    if (!decoded) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const { packageName } = req.body ?? {};
    if (!packageName || !(packageName in grantPackages)) {
      res.status(400).json({ error: "Invalid package name" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const packageData = grantPackages[packageName as keyof typeof grantPackages];

    user.selectedPackage = packageName as any;
    user.grantAmount = packageData.grant;
    user.feeAmount = packageData.fee;
    user.paymentStatus = "pending";
    await user.save();

    let userEmailSent = false;
    let adminEmailSent = false;

    try {
      const userEmail = demoPackageEmail(
        user.firstName,
        user.refNumber,
        packageName,
        packageData.grant,
      );

      const adminNotice = demoAdminPackageEmail({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        refNumber: user.refNumber,
        packageName,
        grantAmount: packageData.grant,
      });

      [userEmailSent, adminEmailSent] = await Promise.all([
        sendNotificationSafely("Demo package selection user", () =>
          sendEmail(user.email, userEmail.subject, userEmail.html),
        ),
        sendNotificationSafely("Demo package selection admin", () =>
          sendAdminNotification(adminNotice.subject, adminNotice.html),
        ),
      ]);
    } catch (error) {
      console.error("Demo package notification setup failed:", error);
    }

    res.json({
      success: true,
      message: "Package selected successfully",
      data: {
        selectedPackage: user.selectedPackage,
        grantAmount: user.grantAmount,
        feeAmount: user.feeAmount,
        refNumber: user.refNumber,
        notifications: {
          userEmailSent,
          adminEmailSent,
        },
      },
    });
  } catch (error) {
    console.error("Select package error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to select package",
    });
  }
});

router.post("/confirm-payment", async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = verifyToken(authHeader.substring(7));
    if (!decoded) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const { transactionId } = req.body ?? {};
    if (!transactionId) {
      res.status(400).json({ error: "Transaction ID required" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.grantAmount || !user.feeAmount) {
      res.status(400).json({ error: "Please select a package first" });
      return;
    }

    user.paymentStatus = "pending";
    user.paymentReceipt = undefined;
    await user.save();

    try {
      const { subject, html } = emailTemplates.paymentConfirmation(
        user.firstName,
        user.refNumber,
        user.grantAmount,
      );
      void sendNotificationSafely("Payment confirmation", () =>
        sendEmail(user.email, subject, html),
      );
    } catch (error) {
      console.error("Payment confirmation notification setup failed:", error);
    }

    res.json({
      success: true,
      message: "Payment confirmation submitted successfully. No real payment was processed.",
      data: {
        paymentStatus: user.paymentStatus,
        refNumber: user.refNumber,
        grantAmount: user.grantAmount,
      },
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
});

router.get("/dashboard", async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = verifyToken(authHeader.substring(7));
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
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

export default router;
