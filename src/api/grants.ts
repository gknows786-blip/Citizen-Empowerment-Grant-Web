import { Router, Request, Response } from 'express';
import { User } from '../models/User.js';
import { sendEmail, emailTemplates } from '../lib/emailService.js';
import { verifyToken } from '../lib/authUtils.js';

const router = Router();

// Grant packages
const grantPackages = {
  Basic: { grant: 10000, fee: 100 },
  Silver: { grant: 20000, fee: 200 },
  Gold: { grant: 50000, fee: 500 },
  Platinum: { grant: 100000, fee: 1000 },
  Diamond: { grant: 200000, fee: 2000 },
};

// Get available packages
router.get('/packages', (req: Request, res: Response) => {
  const packages = Object.entries(grantPackages).map(([name, amounts]) => ({
    name,
    grantAmount: amounts.grant,
    feeRequired: amounts.fee,
  }));

  res.json({
    success: true,
    packages,
  });
});

// Select a grant package
router.post('/select-package', async (req: Request, res: Response) => {
  try {
    // Verify token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { packageName } = req.body;
    if (!packageName || !(packageName in grantPackages)) {
      return res.status(400).json({ error: 'Invalid package name' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user with selected package
    const packageData = grantPackages[packageName as keyof typeof grantPackages];
    user.selectedPackage = packageName as any;
    user.grantAmount = packageData.grant;
    user.feeAmount = packageData.fee;
    user.paymentStatus = 'pending';
    await user.save();

    // Send email with payment instructions
    const { subject, html } = emailTemplates.packageSelectionEmail(
      user.firstName,
      user.refNumber,
      packageData.grant,
      packageData.fee
    );
    await sendEmail(user.email, subject, html);

    res.json({
      success: true,
      message: 'Package selected successfully',
      data: {
        selectedPackage: user.selectedPackage,
        grantAmount: user.grantAmount,
        feeAmount: user.feeAmount,
        refNumber: user.refNumber,
      },
    });
  } catch (error) {
    console.error('Select package error:', error);
    res.status(500).json({ error: 'Failed to select package' });
  }
});

// Confirm payment
router.post('/confirm-payment', async (req: Request, res: Response) => {
  try {
    // Verify token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { transactionId, receiptPath } = req.body;
    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID required' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.grantAmount || !user.feeAmount) {
      return res.status(400).json({ error: 'Please select a package first' });
    }

    // Update payment status
    user.paymentStatus = 'paid';
    user.paymentReceipt = receiptPath || transactionId;
    await user.save();

    // Send payment confirmation email
    const { subject, html } = emailTemplates.paymentConfirmation(
      user.firstName,
      user.refNumber,
      user.grantAmount
    );
    await sendEmail(user.email, subject, html);

    res.json({
      success: true,
      message: 'Payment confirmed! Your grant will be delivered within 24 hours.',
      data: {
        paymentStatus: user.paymentStatus,
        refNumber: user.refNumber,
        grantAmount: user.grantAmount,
      },
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Get user dashboard data
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Verify token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

export default router;
