// backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text, attachmentPath) {
  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: `"AI Report Generator" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "AI_Report.pdf",
        path: attachmentPath,
      },
    ],
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
