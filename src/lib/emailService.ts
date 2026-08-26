import nodemailer from "nodemailer";

const getEnv = (key: string): string => {
  return (process.env as Record<string, string | undefined>)[key] || "";
};

const smtpHost = getEnv("SMTP_HOST");
const smtpPort = Number(getEnv("SMTP_PORT") || 587);
const smtpUser = getEnv("SMTP_USER");
const smtpPassword = getEnv("SMTP_PASSWORD");

const transporter =
  smtpHost && smtpUser && smtpPassword
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      })
    : null;

/* -------------------------------------------------------------------------- */
/* EMAIL SENDER                                                               */
/* -------------------------------------------------------------------------- */

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
) => {
  try {
    const apiKey = (process.env as Record<string, string | undefined>)["BREVO_API_KEY"] || "";
    const fromEmail =
      getEnv("EMAIL_FROM") ||
      "noreply@grantportal.gov";

    if (!apiKey) {
      console.error("BREVO_API_KEY is not configured.");
      return false;
    }

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "Grant Management Portal",
            email: fromEmail,
          },
          to: [
            {
              email: to,
            },
          ],
          subject,
          htmlContent: html,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Brevo API email error:",
        response.status,
        errorText,
      );
      return false;
    }

    const result = await response.json();
    console.log("Email sent successfully through Brevo:", result);
    return true;
  } catch (error) {
    console.error("Brevo API email error:", error);
    return false;
  }
};

/* -------------------------------------------------------------------------- */
/* ADMIN NOTIFICATION                                                         */
/* -------------------------------------------------------------------------- */

export const sendAdminNotification = async (
  subject: string,
  html: string,
) => {
  const adminEmail = getEnv("ADMIN_EMAIL");

  if (!adminEmail) {
    console.log(
      `[Admin Email Simulation] Subject: ${subject}`,
    );
    return true;
  }

  return sendEmail(
    adminEmail,
    `[GRANT PORTAL] ${subject}`,
    html,
  );
};

/* -------------------------------------------------------------------------- */
/* SHARED EMAIL LAYOUT                                                        */
/* -------------------------------------------------------------------------- */

const emailLayout = (
  title: string,
  content: string,
  badge?: string,
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f0f4f8;
  font-family:'Segoe UI',Arial,Helvetica,sans-serif;
  color:#1e293b;
">

  <!-- PREHEADER TEXT (hidden in most clients) -->
  <div style="display:none;font-size:1px;color:#f0f4f8;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${title} — Grant Management Portal
  </div>

  <div style="
    max-width:600px;
    margin:30px auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 24px rgba(0,0,0,0.06);
  ">

    <!-- HEADER with seal/logo -->
    <div style="
      background:linear-gradient(135deg,#1e3a5f,#2d5a87);
      padding:32px 28px 24px;
      text-align:center;
      color:white;
      position:relative;
    ">

      <!-- Decorative top accent line -->
      <div style="
        position:absolute;
        top:0;
        left:0;
        right:0;
        height:4px;
        background:linear-gradient(90deg,#f59e0b,#d97706,#f59e0b);
      "></div>

      <!-- Government seal icon (SVG inline) -->
      <div style="margin-bottom:12px;">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>

      <h1 style="
        margin:0;
        font-size:22px;
        font-weight:600;
        letter-spacing:0.3px;
      ">
        Grant Management Portal
      </h1>

      <p style="
        margin:6px 0 0;
        color:#bfdbfe;
        font-size:13px;
        font-weight:400;
        letter-spacing:0.2px;
      ">
        Official Communication • United States Grant Program
      </p>

      ${badge ? `
        <div style="
          display:inline-block;
          margin-top:14px;
          background:rgba(255,255,255,0.12);
          border:1px solid rgba(255,255,255,0.2);
          padding:6px 16px;
          border-radius:100px;
          font-size:12px;
          font-weight:500;
          letter-spacing:0.4px;
          color:#e0f2fe;
        ">
          ${badge}
        </div>
      ` : ''}

    </div>

    <!-- CONTENT -->
    <div style="
      padding:28px 32px 32px;
    ">

      ${content}

    </div>

    <!-- FOOTER -->
    <div style="
      background:#f8fafc;
      border-top:1px solid #e2e8f0;
      padding:24px 28px;
      text-align:center;
    ">

      <div style="
        margin-bottom:14px;
        font-size:11px;
        font-weight:600;
        color:#64748b;
        letter-spacing:1px;
        text-transform:uppercase;
      ">
        Grant Management Portal
      </div>

      <p style="
        margin:0;
        font-size:12px;
        line-height:1.7;
        color:#64748b;
      ">
        This is an automated message from the Grant Management Portal.<br/>
        Please do not reply directly to this email.
      </p>

      <div style="
        margin-top:16px;
        padding-top:16px;
        border-top:1px solid #e2e8f0;
        font-size:11px;
            </div>

    <!-- DISCLAIMER -->
    <div style="
      margin-top:20px;
      padding:14px 16px;
      background:#f0f9ff;
      border:1px solid #bae6fd;
      border-radius:8px;
      font-size:12px;
      line-height:1.6;
      color:#1e40af;
      text-align:left;
    ">
      <strong>ⓘ Confidentiality Notice:</strong> This email and any attachments
      are intended solely for the named recipient. If you received this in error,
      please notify the sender and delete it. Unauthorized use or disclosure
      is prohibited by law.
    </div>

  </div>

  <div style="
    max-width:600px;
    margin:030px;
    text-align:center;
    font-size:11px;
    color:#94a3b8;
    line-height:1.6;
  ">
    <p style="margin:0;">
      Grant Management Portal • U.S. Government Services<br/>
      1600 Pennsylvania Ave NW, Washington, DC 20500
    </p>
  </div>

</div>

</body>
</html>
`;

/* -------------------------------------------------------------------------- */
/* EMAIL TEMPLATES                                                            */
/* -------------------------------------------------------------------------- */

export const emailTemplates = {

  /* ------------------------------------------------------------------------ */
  /* WELCOME / ACCOUNT CREATED                                                */
  /* ------------------------------------------------------------------------ */

  welcome: (
    firstName: string,
    refNumber: string,
  ) => ({
    subject: `Welcome to the Grant Management Portal — Reference: ${refNumber}`,

    html: emailLayout(
      "Welcome to Grant Management Portal",
      `
        <h2 style="
          margin:0 0 16px;
          color:#1e3a5f;
          font-size:20px;
          font-weight:600;
        ">
          Welcome, ${firstName}! 🎉
        </h2>

        <p style="
          margin:0 0 20px;
          font-size:15px;
          line-height:1.7;
          color:#475569;
        ">
          Your account has been successfully created in the
          <strong>Grant Management Portal</strong>. You now have access
          to federal grant opportunities, application tracking, and
          secure communication with program officers.
        </p>

        <div style="
          margin:24px 0;
          padding:20px;
          background:#f8fafc;
          border:1px solid #e2e8f0;
          border-radius:10px;
        ">
          <div style="
            font-size:12px;
            color:#64748b;
            margin-bottom:6px;
            text-transform:uppercase;
            letter-spacing:1px;
          ">
            Your Account Reference Number
          </div>
          <div style="
            font-size:24px;
            font-weight:bold;
            letter-spacing:2px;
            color:#1e3a5f;
            font-family:'Courier New',monospace;
          ">
            ${refNumber}
          </div>
        </div>

        <h3 style="
          margin:24px 0 12px;
          color:#1e3a5f;
          font-size:16px;
        ">
          Getting Started
        </h3>

        <ul style="
          margin:0;
          padding-left:20px;
          font-size:14px;
          line-height:2;
          color:#475569;
        ">
          <li>Log in to your dashboard to view available grants</li>
          <li>Complete your organization profile for faster applications</li>
          <li>Set up email notifications for deadline reminders</li>
          <li>Review eligibility criteria before applying</li>
        </ul>

        <div style="
          margin-top:28px;
          text-align:center;
        ">
          <a
            href="https://grantportal.gov/dashboard"
            style="
              display:inline-block;
              background:#1e3a5f;
              color:white;
              padding:14px 32px;
              border-radius:8px;
              text-decoration:none;
              font-weight:600;
              font-size:15px;
            "
          >
            Go to Dashboard →
          </a>
        </div>
      `,
      "ACCOUNT CREATED"
    ),
  }),

  /* ------------------------------------------------------------------------ */
  /* ADMIN: NEW USER REGISTRATION                                             */
  /* ------------------------------------------------------------------------ */

  adminNewUser: (user: {
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
  subject: `New User Registration — ${user.firstName} ${user.lastName} (${user.refNumber})`,

  html: emailLayout(
    "New User Registration Alert",
    `
      <h2 style="
        margin:0 0 16px;
        color:#1e3a5f;
        font-size:18px;
      ">
        🔔 New User Registered
      </h2>

      <p style="
        margin:0 0 20px;
        color:#475569;
        font-size:14px;
        line-height:1.6;
      ">
        A new user has registered on the Grant Management Portal.
        Please review the details below.
      </p>

      <table style="
        width:100%;
        border-collapse:collapse;
        font-size:14px;
        color:#475569;
      ">
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;width:140px;">Full Name</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${user.firstName} ${user.lastName}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;">Email</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${user.email}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;">Phone</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${user.phone}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;">Reference #</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${user.refNumber}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;">Occupation</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${user.occupation || 'Not provided'} </tr>
        <tr>
          <td style="padding:10px 12px;font-weight:600;">Location</td>
          <td style="padding:10px 12px;">user.city∣∣′′,{user.city || ''},user.city∣∣′′,{user.state || ''}, ${user.country || ''}</td>
        </tr>
      </table>

      <p style="
        margin-top:20px;
-size:12px;
        color:#94a3b8;
      ">
        Registered at: ${new Date().toUTCString()}
      </p>
    `,
    "ADMIN NOTIFICATION"
  ),
}),

  /* ------------------------------------------------------------------------ */
  /* USER SIGN-IN ALERT                                                       */
  /* ------------------------------------------------------------------------ */

  adminUserLogin: (user: {
    firstName: string;
    lastName: string;
    email: string;
    refNumber: string;
  }) => ({
  subject: `User Login — ${user.firstName} ${user.lastName} (${user.refNumber})`,

  html: emailLayout(
    "User Login Alert",
    `
      <h2 style="margin:0 0 16px;color:#1e3a5f;font-size:18px;">
        🔐 Account Access Notification
      </h2>

      <p style="color:#475569;font-size:14px;line-height:1.6;">
        The following user has accessed their account on the Grant Management Portal.
      </p>
      <table style="
        width:100%;
        border-collapse:collapse;
        font-size:14px;
        color:#475569;
        margin:20px 0;
      ">
        <tr>
          <td style="padding:12px 14px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;width:140px;">Name</td>
          <td style="padding:12px 14px;border:1px solid #e2e8f0;">${user.firstName} ${user.lastName}</td>
        </tr>
        <tr>
          <td style="padding:12px 14px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;">Email</td>
          <td style="padding:12px 14px;border:1px solid #e2e8f0;">${user.email}</td>
        </tr>
        <tr>
          <td style="padding:12px 14px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;">Reference #</td>
          <td style="padding:12px 14px;border:1px solid #e2e8f0;font-family:monospace;font-weight:bold;">${user.refNumber}</td>
        </tr>
        <tr>
          <td style="padding:12px 14px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;">Time</td>
          <td style="padding:12px 14px;border:1px solid #e2e8f0;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} EST</td>
        </tr>
      </table>

      <div style="
        padding:14px;
        background:#fef3c7;
        border:1px solid #fcd34d;
        border-radius:8px;
        font-size:13px;
        color:#92400e;
        line-height:1.6;
      ">
        ⚠️ If you did not authorize this access, please review your
        account security settings immediately.
      </div>
    `,
    "SECURT"
  ),
}),

  /* ------------------------------------------------------------------------ */
  /* GRANT APPLICATION SUBMITTED                                              */
  /* ------------------------------------------------------------------------ */

  applicationSubmitted: (
    firstName: string,
    refNumber: string,
    grantTitle: string,
  ) => ({
    subject: `Grant Application Received — grantTitle({grantTitle} (grantTitle({refNumber})`,

    html: emailLayout(
      "Grant Application Submitted",
      `
        <h2 style="
          margin:0 0 16px;
          color:#1e3a5f;
          font-size:20px;
          font-weight:600;
        ">
          ✅ Application Successfully Submitted
        </h2>

        <p style="
          margin:0 0 20px;
          font-size:15px;
          line-height:1.7;
          color:#475569;
        ">
          Dear ${firstName},
        </p>

        <p style="
          margin:0 0 20px;
          font-size:15px;
          line-height:1.7;
          color:#475569;
        ">
          Your application for <strong>"${grantTitle}"</strong> has been
          received by the Grant Management Portal. Your application is
          now being reviewed for completeness and eligibility.
        </p>

        <div style="
          margin:24px 0;
          padding:20px;
          background:#f0fdf4;
          border:1px solid #bbf7d0;
          border-radius:10px;
        ">
          <div style="
            font-size:12px;
            color:#16a34a;
            margin-bottom:8px;
            text-transform:uppercase;
            letter-spacing:1px;
          ">
            Application Reference Number
          </div>
          <div style="
            font-size:22px;
            font-weight:bold;
            letter-spacing:2px;
            color:#15803d;
            font-family:'Courier New',monospace;
          ">
            ${refNumber}
          </div>
        </div>

        <h3 style="
          margin:24px 0 12px;
          color:#1e3a5f;
          font-size:16px;
        ">
          What Happens Next?
        </h3>

        <ul style="
          margin:0;
          padding-left:20px;
          font-size:14px;
          line-height:2;
          color:#475569;
        ">
          <li>Application review (5–7 business days)</li>
          <li>Eligibility verification</li>
          <li>Technical evaluation by program officers</li>
          <li>Final determination and award notification</li>
        </ul>

        <p style="
          margin-top:20px;
          font-size:13px;
          color:#64748b;
          line-height:1.6;
        ">
          You will receive status updates throughout the review process.
          You can also track your application status in your dashboard.
        </p>
      `,
      "APPLICATION CONFIRMATION"
    ),
  }),

  /* ------------------------------------------------------------------------ */
  /* ADMIN: NEW GRANT APPLICATION                                            */
  /* ------------------------------------------------------------------------ */

  adminNewApplication: (applicant: {
    firstName: string;
    lastName: string;
    email: string;
    refNumber: string;
    grantTitle: string;
  }) => ({
    subject: `New Grant Application — applicant.grantTitle({applicant.grantTitle} (applicant.grantTitle({applicant.refNumber})`,

    html: emailLayout(
      "New Grant Application Received",
      `
        <h2 style="
          margin:0 0 16px;
          color:#1e3a5f;
          font-size:18px;
        ">
          📄 New Grant Application Submitted
        </h2>

        <p style="
          margin:0 0 20px;
          color:#475569;
          font-size:14px;
          line-height:1.6;
        ">
          A new grant application has been submitted for review.
          Please assign a program officer to this case.
        </p>

        <table style="
          width:100%;
          border-collapse:collapse;
          font-size:14px;
          color:#475569;
        ">
          <tr>
            <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;width:160px;">Applicant</td>
            <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;">applicant.firstName{applicant.firstName}applicant.firstName{applicant.lastName}</td>
          </tr>
          <tr>
            <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;">Email</td>
            <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;">${applicant.email}</td>
          </tr>
          <tr>
            <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;">Grant Program</td>
            <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-weight:bold;">${applicant.grantTitle}</td>
          </tr>
          <tr>
            <td style="padding:12px 14px;font-weight:600;">Reference #</td>
            <td style="padding:12px 14px;font-family:monospace;font-weight:bold;color:#1e3a5f;">${applicant.refNumber}</td>
          </tr>
        </table>

        <div style="
          margin-top:20px;
          text-align:center;
        ">
          <a
            href="https://grantportal.gov/admin/applications/${applicant.refNumber}"
            style="
              display:inline-block;
              background:#1e3a5f;
              color:white;
              padding:12px 28px;
              border-radius:8px;
              text-decoration:none;
              font-weight:600;
              font-size:14px;
            "
          >
            Review Application →
          </a>
        </div>
      `,
      "ADMIN NOTIFICATION"
    ),
  }),

  /* ------------------------------------------------------------------------ */
  /* GRANT APPROVAL                                                           */
  /* ------------------------------------------------------------------------ */

  grantApproved: (
    firstName: string,
    refNumber: string,
    grantTitle: string,
    grantAmount: number,
  ) => ({
    subject: `✅ Grant Approved — grantTitle({grantTitle} (grantTitle({refNumber})`,

    html: emailLayout(
      "Grant Application Approved",
      `
        <h2 style="
          margin:0 0 16px;
          color:#15803d;
          font-size:20px;
          font-weight:600;
        ">
          🎉 Congratulations! Grant Approved
        </h2>

        <p style="
          margin:0 0 20px;
          font-size:15px;
          line-height:1.7;
          color:#475569;
        ">
          Dear ${firstName},
        </p>

        <p style="
          margin:0 0 20px;
          font-size:15px;
          line-height:1.7;
          color:#475569;
        ">
          We are pleased to inform you that your application for
          <strong>"${grantTitle}"</strong> has been
          <strong style="color:#15803d;">approved</strong>.
        </p>

        <div style="
          margin:24px 0;
          padding:24px;
          background:#f0fdf4;
          border:2px solid #86efac;
          border-radius:12px;
          text-align:center;
        ">
          <div style="
            font-size:12px;
            color:#16a34a;
            margin-bottom:8px;
            text-transform:uppercase;
            letter-spacing:1px;
          ">
            Award Amount
          </div>
          <div style="
            font-size:36px;
            font-weight:bold;
            color:#15803d;
            letter-spacing:2px;
          ">
            {grantAmount.toLocaleString()}
          </div>
          <div style="
            margin-top:8px;
            font-size:13px;
            color:#16a34a;
          ">
            Reference: ${refNumber}
          </div>
        </div>

        <h3 style="
          margin:24px 0 12px;
          color:#1e3a5f;
          font-size:16px;
        ">
          Next Steps
        </h3>

        <ul style="
          margin:0;
          padding-left:20px;
          font-size:14px;
          line-height:2;
          color:#475569;
        ">
          <li>Accept the award terms via your dashboard</li>
          <li>Submit required documentation for disbursement</li>
          <li>Review reporting requirements and deadlines</li>
          <li>Contact your assigned program officer with questions</li>
        </ul>

        <div style="
          margin-top:28px;
          text-align:center;
        ">
          <a
            href="https://grantportal.gov/dashboard"
            style="
              display:inline-block;
              background:#15803d;
              color:white;
              padding:14px 32px;
              border-radius:8px;
              text-decoration:none;
              font-weight:600;
              font-size:15px;
            "
          >
            Accept Award →
          </a>
        </div>
      `,
      "GRANT APPROVED"
    ),
  }),

  /* ------------------------------------------------------------------------ */
  /* PAYMENT CONFIRMATION                                                     */
  /* ------------------------------------------------------------------------ */

  paymentConfirmation: (
    firstName: string,
    refNumber: string,
    grantAmount: number,
  ) => ({
    subject: `Payment Confirmed — ${refNumber}`,

    html: emailLayout(
      "Payment Confirmation",
      `
        <h2 style="
          margin:0 0 16px;
          color:#15803d;
          font-size:20px;
          font-weight:600;
        ">
          💰 Payment Processed Successfully
        </h2>

        <p style="
          margin:0 0 20px;
          font-size:15px;
          line-height:1.7;
          color:#475569;
        ">
          Dear ${firstName},
        </p>

        <p style="
          margin:0 0 20px;
          font-size:15px;
          line-height:1.7;
          color:#475569;
        ">
          We have processed the disbursement for your approved grant.
          The funds will be transferred to your designated account
          within 3–5 business days.
        </p>

        <div style="
          margin:24px 0;
          padding:20px;
          background:#f8fafc;
          border:1px solid #e2e8f0;
          border-radius:10px;
        ">
          <table style="
            width:100%;
            border-collapse:collapse;
            font-size:14px;
            color:#475569;
          ">
            <tr>
              <td style="padding:8px 12px;font-weight:600;width:160px;">Reference #</td>
              <td style="padding:8px 12px;font-family:monospace;">${refNumber}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:600;">Amount</td>
              <td style="padding:8px 12px;font-weight:bold;color:#15803d;">{grantAmount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:600;">Status</td>
              <td style="padding:8px 12px;color:#16a34 Completed</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:600;">Date</td>
              <td style="padding:8px 12px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>

        <p style="
          font-size:13px;
          color:#64748b;
          line-height:1.6;
        ">
          If you have any questions regarding this disbursement,
          please contact your program officer or visit the
          <a href="https://grantportal.gov/help" style="color:#1e3a5f;">Help Center</a>.
        </p>
      `,
      " CONFIRMED"
    ),
  }),

  /* ------------------------------------------------------------------------ */
  /* PASSWORD RESET                                                           */
  /* ------------------------------------------------------------------------ */

  passwordReset: (resetUrl: string) => ({
    subject: "Password Reset Request — Grant Management Portal",

    html: emailLayout(
      "Password Reset",
      `
        <h2 style="
          margin:0 0 16px;
          color:#1ef;
          font-size:20px;
          font-weight:600;
        ">
          🔑 Password Reset Request
        </h2>

        <p style="
          margin:0 0 20px;
          font-size:15px;
          line-height:1.7;
          color:#475569;
        ">
          We received a request to reset the password for your
          Grant account. To proceed, click the
          button below.
        </p>

        <div style="
          text-align:center;
          margin:28px 0;
        ">
          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              background:#1e3a5f;
              color:white;
              padding:14px 28px;
              border-radius:8px;
              text-decoration:none;
              font-weight:600;
              font-size:15px;
              letter-spacing:0.5px;
            "
            >
            Reset Password
          </a>

        </div>

        <p style="
          font-size:12px;
          color:#64748b;
          line-height:1.6;
        ">
          This reset link expires in 1 hour.
          If you did not request this, you can safely ignore
          this email.
        </p>
      `,
    ),
  }),
};
