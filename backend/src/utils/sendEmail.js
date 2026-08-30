const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  console.log("========== EMAIL CONFIG ==========");
  console.log("HOST:", process.env.SMTP_HOST);
  console.log("PORT:", process.env.SMTP_PORT);
  console.log("SECURE:", process.env.SMTP_SECURE);
  console.log("USER:", process.env.SMTP_USER);
  console.log("FROM:", process.env.EMAIL_FROM);
  console.log("=================================");

  const isGmail = (process.env.SMTP_HOST || '').includes('gmail.com');
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  // Force IPv4 by NOT using 'service: gmail' and explicitly setting host and family
  const transportConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
    // This forces Node to use IPv4 instead of IPv6 (fixes ENETUNREACH on Render/Vercel)
    family: 4
  };

  const transporter = nodemailer.createTransport(transportConfig);

  try {
    await transporter.verify();

    console.log("SMTP connection successful.");

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    };

    if (html) {
      mailOptions.html = html;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("Response:", error.response);
    console.error("Message:", error.message);
    console.error("================================");

    throw error;
  }
};

module.exports = sendEmail;