import nodemailer from "nodemailer";

const getEnv = (key: string): string => {
  return (process.env as Record<string, string | undefined>)[key] || "";
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: getEnv("EMAIL_USER"),
    pass: getEnv("EMAIL_PASSWORD"),
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const from = getEnv("EMAIL_FROM") || getEnv("EMAIL_USER") || "no-reply@usfederalgrant.gov";
    if (!getEnv("EMAIL_USER")) {
      console.log(`[Email Service Simulation] To: ${to} | Subject: ${subject}`);
      return true;
    }
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

export const sendAdminNotification = async (subject: string, html: string) => {
  const adminEmail = getEnv("ADMIN_EMAIL") || getEnv("EMAIL_USER") || "admin@usfederalgrant.gov";
  return sendEmail(adminEmail, `[ADMIN ALERT] ${subject}`, html);
};

// Email templates
export const emailTemplates = {
  signupConfirmation: (firstName: string, refNumber: string) => ({
    subject: `Welcome to U.S. Federal Citizen Grant Program - Ref: ${refNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1E3A8A; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">U.S. Federal Citizen Grant &amp; Empowerment Program</h1>
          <p style="margin: 6px 0 0; color: #BFDBFE; font-size: 14px;">Official Citizen Empowerment Portal</p>
        </div>
        <div style="padding: 28px; background-color: #f8fafc; color: #1e293b;">
          <h2 style="color: #1E3A8A; margin-top: 0;">Welcome, ${firstName}!</h2>
          <p>Congratulations! Your grant claim application has been successfully registered in the federal portal.</p>

          <div style="background-color: #ffffff; padding: 18px; border-radius: 6px; border: 1px solid #cbd5e1; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Reference Number:</strong> <span style="font-family: monospace; color: #1e3a8a; font-weight: bold; font-size: 16px;">${refNumber}</span></p>
            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">APPROVED — PENDING SELECTION</span></p>
          </div>

          <h3 style="color: #1e3a8a; margin-bottom: 8px;">Next Steps:</h3>
          <ol style="padding-left: 20px; line-height: 1.6;">
            <li>Log in to your Grant Dashboard using your email and password</li>
            <li>Review and choose your approved Grant Package</li>
            <li>Confirm your claim status for immediate processing and delivery</li>
          </ol>

          <p style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; color: #991b1b; font-size: 13px; margin-top: 20px;">
            <strong>Confidentiality Notice:</strong> Keep your reference number safe and confidential.
          </p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0;">
            U.S. Department of Citizen Economic Empowerment<br/>
            100 Independence Avenue, Washington, D.C. 20500<br/>
            Official Portal Support Team
          </p>
        </div>
      </div>
    `,
  }),

  adminNewUserRegistered: (user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: string | Date;
    occupation?: string;
    city?: string;
    state?: string;
    country?: string;
    refNumber: string;
  }) => ({
    subject: `New User Registered: ${user.firstName} ${user.lastName} (${user.refNumber})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">🔔 New User Registration Alert</h2>
          <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Portal Owner Notification</p>
        </div>
        <div style="padding: 24px; background-color: #f8fafc; color: #1e293b;">
          <p>A new applicant has just registered on the portal:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: white; border: 1px solid #e2e8f0; border-radius: 6px;">
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; width: 40%; color: #475569;">Full Name:</td><td style="padding: 10px; color: #0f172a;">${user.firstName} ${user.lastName}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #475569;">Email:</td><td style="padding: 10px; color: #0f172a;">${user.email}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #475569;">Phone:</td><td style="padding: 10px; color: #0f172a;">${user.phone}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #475569;">Reference Number:</td><td style="padding: 10px; font-family: monospace; font-weight: bold; color: #2563eb;">${user.refNumber}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #475569;">Occupation:</td><td style="padding: 10px; color: #0f172a;">${user.occupation || "N/A"}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #475569;">Location:</td><td style="padding: 10px; color: #0f172a;">${user.city || ""}, ${user.state || ""}, ${user.country || ""}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #475569;">Registered At:</td><td style="padding: 10px; color: #0f172a;">${new Date().toUTCString()}</td></tr>
          </table>
        </div>
      </div>
    `,
  }),

  adminUserSignedIn: (user: {
    firstName: string;
    lastName: string;
    email: string;
    refNumber: string;
  }) => ({
    subject: `User Signed In: ${user.firstName} ${user.lastName} (${user.email})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e293b; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">🔑 User Sign In Alert</h2>
          <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Portal Activity Notification</p>
        </div>
        <div style="padding: 24px; background-color: #f8fafc; color: #1e293b;">
          <p>A registered user has just logged into the portal:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: white; border: 1px solid #e2e8f0; border-radius: 6px;">
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; width: 40%; color: #475569;">Name:</td><td style="padding: 10px; color: #0f172a;">${user.firstName} ${user.lastName}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #475569;">Email:</td><td style="padding: 10px; color: #0f172a;">${user.email}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #475569;">Reference Number:</td><td style="padding: 10px; font-family: monospace; font-weight: bold; color: #2563eb;">${user.refNumber}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #475569;">Sign In Time:</td><td style="padding: 10px; color: #0f172a;">${new Date().toUTCString()}</td></tr>
          </table>
        </div>
      </div>
    `,
  }),

  packageSelectionEmail: (
    firstName: string,
    refNumber: string,
    grantAmount: number,
    fee: number,
  ) => ({
    subject: `Payment Instructions for Your Federal Grant Delivery — Ref: ${refNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1E3A8A; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">U.S. Federal Citizen Grant Program</h1>
          <p style="margin: 6px 0 0; color: #BFDBFE;">Official Claim Instructions</p>
        </div>
        <div style="padding: 28px; background-color: #f8fafc; color: #1e293b;">
          <h2 style="color: #1E3A8A; margin-top: 0;">Dear ${firstName},</h2>
          <p>You have selected the <strong>$${grantAmount.toLocaleString()}</strong> grant package.</p>

          <div style="background-color: white; padding: 20px; border-radius: 6px; border: 1px solid #cbd5e1; margin: 20px 0;">
            <p><strong>Reference Number:</strong> <span style="font-family: monospace; color: #1e3a8a; font-weight: bold;">${refNumber}</span></p>
            <p><strong>Grant Amount:</strong> <span style="color: #16a34a; font-weight: bold;">$${grantAmount.toLocaleString()}</span></p>
            <p><strong>Processing &amp; Clearance Fee:</strong> $${fee}</p>
          </div>

          <p>Please log in to your dashboard to view complete payment clearance instructions and track your disbursement status.</p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b;">
            U.S. Department of Citizen Economic Empowerment<br/>
            100 Independence Avenue, Washington, D.C. 20500
          </p>
        </div>
      </div>
    `,
  }),

  paymentConfirmation: (firstName: string, refNumber: string, grantAmount: number) => ({
    subject: `Payment Status Recorded - Ref: ${refNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1E3A8A; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">U.S. Federal Citizen Grant Program</h1>
        </div>
        <div style="padding: 28px; background-color: #f8fafc; color: #1e293b;">
          <h2 style="color: #16a34a; margin-top: 0;">Payment Confirmation Recorded</h2>
          <p>Dear ${firstName},</p>
          <p>Your payment confirmation for the <strong>$${grantAmount.toLocaleString()}</strong> grant has been received and logged for review.</p>
          <p><strong>Reference Number:</strong> <span style="font-family: monospace;">${refNumber}</span></p>
          <p>Your dashboard will update once verification is complete.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetUrl: string) => ({
    subject: "Password Reset - U.S. Federal Citizen Grant Program",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1E3A8A; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Password Reset Request</h1>
        </div>
        <div style="padding: 24px; background-color: #f8fafc;">
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetUrl}" style="background-color: #1E3A8A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
          <p style="font-size: 12px; color: #64748b;">This link expires in 1 hour.</p>
        </div>
      </div>
    `,
  }),
};
