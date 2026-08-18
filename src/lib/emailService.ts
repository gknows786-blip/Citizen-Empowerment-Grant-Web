import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

// Email templates
export const emailTemplates = {
  signupConfirmation: (firstName: string, refNumber: string) => ({
    subject: `Welcome to U.S. Federal Citizen Grant Program - Ref: ${refNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1B2A4A; color: white; padding: 20px; text-align: center;">
          <h1>U.S. Federal Citizen Grant & Empowerment Program</h1>
          <p>Official Government Initiative</p>
        </div>
        <div style="padding: 30px; background-color: #f5f5f5;">
          <h2>Welcome, ${firstName}!</h2>
          <p>Congratulations! Your claim has been successfully registered in our federal database.</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your Reference Number:</strong> ${refNumber}</p>
            <p><strong>Status:</strong> ✅ CLAIM APPROVED - PENDING DELIVERY</p>
          </div>
          
          <p>Next steps:</p>
          <ol>
            <li>Log in to your dashboard</li>
            <li>Select your grant package</li>
            <li>Complete payment verification</li>
            <li>Receive your grant via UPS/FedEx</li>
          </ol>
          
          <p style="color: red;"><strong>⚠️ IMPORTANT:</strong> Keep your reference number confidential. Do NOT share with anyone.</p>
          
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            U.S. Department of Economic Empowerment<br/>
            100 Independence Avenue, Washington, D.C. 20500<br/>
            support@usfederalgrant.gov | (202) 555-0199
          </p>
        </div>
      </div>
    `,
  }),

  packageSelectionEmail: (firstName: string, refNumber: string, grantAmount: number, fee: number) => ({
    subject: `URGENT: Payment Instructions for Your Federal Grant Delivery — Ref: ${refNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1B2A4A; color: white; padding: 20px; text-align: center;">
          <h1>U.S. Federal Citizen Grant & Empowerment Program</h1>
          <p>Official Government Communication</p>
        </div>
        <div style="padding: 30px; background-color: #f5f5f5;">
          <h2>Dear ${firstName},</h2>
          <p>Congratulations! You have successfully selected your grant package of <strong>$${grantAmount.toLocaleString()}</strong>.</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>REFERENCE NUMBER:</strong> ${refNumber}</p>
            <h3>IMPORTANT NOTICE REGARDING DELIVERY:</h3>
            <p>The funds allocated to your grant have already been sealed, packed, and registered under your name at the Federal Reserve Bank. Per federal law, once funds are packaged and sealed for delivery, no one — not even our officers — is authorized to open, divide, or deduct from the sealed packages.</p>
            
            <h3>REQUIRED PAYMENT:</h3>
            <p>Package Selected: <strong>$${grantAmount.toLocaleString()}</strong></p>
            <p>Processing & Delivery Fee: <strong>$${fee}</strong></p>
            <p style="color: red;"><strong>Payment Deadline: 48 hours</strong></p>
          </div>
          
          <h3>BANK PAYMENT DETAILS:</h3>
          <p>
            <strong>Bank Name:</strong> Bank of America<br/>
            <strong>Account Name:</strong> Federal Grant Clearing House<br/>
            <strong>Account Number:</strong> [Will be provided in dashboard]<br/>
            <strong>Routing Number:</strong> [Will be provided in dashboard]
          </p>
          
          <p style="color: red;"><strong>⚠️ WARNING:</strong> Do NOT tell anyone about your winnings. This is for security reasons so UPS can deliver without interference. Violation will result in cancellation.</p>
          
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            U.S. Department of Economic Empowerment<br/>
            100 Independence Avenue, Washington, D.C. 20500<br/>
            support@usfederalgrant.gov | (202) 555-0199
          </p>
        </div>
      </div>
    `,
  }),

  paymentConfirmation: (firstName: string, refNumber: string, grantAmount: number) => ({
    subject: `Payment Confirmed - Your Grant is Being Prepared - Ref: ${refNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1B2A4A; color: white; padding: 20px; text-align: center;">
          <h1>U.S. Federal Citizen Grant & Empowerment Program</h1>
        </div>
        <div style="padding: 30px; background-color: #f5f5f5;">
          <h2>Payment Confirmed!</h2>
          <p>Dear ${firstName},</p>
          <p>Your payment has been confirmed and your grant of <strong>$${grantAmount.toLocaleString()}</strong> is now being prepared for delivery.</p>
          
          <div style="background-color: #FFD700; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3 style="color: #1B2A4A;">🎉 Your Grant Package is Being Prepared!</h3>
            <p style="color: #1B2A4A;">Expected Delivery: Within 24 Hours</p>
          </div>
          
          <p><strong>Reference Number:</strong> ${refNumber}</p>
          <p>Watch your email for UPS/FedEx tracking information.</p>
          
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            U.S. Department of Economic Empowerment<br/>
            support@usfederalgrant.gov | (202) 555-0199
          </p>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetUrl: string) => ({
    subject: 'Password Reset - U.S. Federal Citizen Grant Program',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1B2A4A; color: white; padding: 20px; text-align: center;">
          <h1>Password Reset</h1>
        </div>
        <div style="padding: 30px; background-color: #f5f5f5;">
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetUrl}" style="background-color: #3C3B6E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
          <p>This link expires in 1 hour.</p>
          <p style="color: red; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  }),
};
