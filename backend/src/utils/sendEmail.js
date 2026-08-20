const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  console.log("========== EMAIL CONFIG ==========");
  console.log("HOST:", process.env.SMTP_HOST);
  console.log("PORT:", process.env.SMTP_PORT);
  console.log("SECURE:", process.env.SMTP_SECURE);
  console.log("USER:", process.env.SMTP_USER);
  console.log("FROM:", process.env.EMAIL_FROM);
  console.log("=================================");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.verify();

    console.log("SMTP connection successful.");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });

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