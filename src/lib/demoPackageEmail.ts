const demoLayout = (title: string, content: string) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#1e293b"><div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #cbd5e1;border-radius:12px;overflow:hidden"><div style="padding:24px;background:#1e3a5f;color:#fff;text-align:center"><div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#f59e0b;color:#172033;font-size:12px;font-weight:700;letter-spacing:.8px">DEMO • SCHOOL PROJECT</div><h1 style="margin:14px 0 4px;font-size:22px">Demo Portal Notification</h1><p style="margin:0;color:#dbeafe;font-size:13px">Fictional demonstration only</p></div><div style="padding:28px">${content}</div><div style="padding:20px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;text-align:center">This email is part of a school/project demonstration. It does not represent a real government award, payment, delivery, clearance, or financial transaction.</div></div></body></html>`;

export const demoPackageEmail = (
  firstName: string,
  refNumber: string,
  packageName: string,
  grantAmount: number,
) => ({
  subject: `DEMO — Package Selected (${refNumber})`,
  html: demoLayout(
    "Demo Package Selection",
    `<h2 style="margin:0 0 16px;color:#1e3a5f">Package Selection Recorded</h2><p style="font-size:15px;line-height:1.7">Hello ${firstName},</p><p style="font-size:15px;line-height:1.7">This is a <strong>demo notification</strong> confirming that you selected a package in the school-project portal.</p><div style="margin:24px 0;padding:18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px"><p style="margin:0 0 10px"><strong>Demo Package:</strong> ${packageName}</p><p style="margin:0 0 10px"><strong>Demo Amount:</strong> $${grantAmount.toLocaleString()}</p><p style="margin:0"><strong>Demo Reference:</strong> ${refNumber}</p></div><p style="font-size:13px;line-height:1.6;color:#64748b">No action or payment is required. This message exists only to demonstrate the email-notification feature.</p>`,
  ),
});

export const demoAdminPackageEmail = (user: {
  firstName: string;
  lastName: string;
  email: string;
  refNumber: string;
  packageName: string;
  grantAmount: number;
}) => ({
  subject: `DEMO — Package Selection (${user.refNumber})`,
  html: demoLayout(
    "Demo Package Selection",
    `<h2 style="margin:0 0 16px;color:#1e3a5f">Demo Package Selection Alert</h2><p style="font-size:14px;line-height:1.6">A user selected a package in the school-project demonstration.</p><table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:700">Name</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">${user.firstName} ${user.lastName}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:700">Email</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">${user.email}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:700">Demo Package</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">${user.packageName}</td></tr><tr><td style="padding:10px;font-weight:700">Demo Reference</td><td style="padding:10px">${user.refNumber}</td></tr></table><p style="margin-top:20px;font-size:13px;color:#64748b">Demo only — no real grant, payment, delivery, or financial transaction is involved.</p>`,
  ),
});
