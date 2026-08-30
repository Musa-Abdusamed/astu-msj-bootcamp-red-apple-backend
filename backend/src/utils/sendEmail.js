const nodemailer = require("nodemailer");
const dns = require("dns");

const sendEmail = async ({ to, subject, text, html }) => {
  console.log("========== EMAIL CONFIG ==========");
  console.log("HOST:", process.env.SMTP_HOST);
  console.log("PORT:", process.env.SMTP_PORT);
  console.log("SECURE:", process.env.SMTP_SECURE);
  console.log("USER:", process.env.SMTP_USER);
  console.log("FROM:", process.env.EMAIL_FROM);
  console.log("=================================");

  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

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
    // Force IPv4 locally just for this email connection (safest approach)
    lookup: (hostname, options, callback) => {
      dns.lookup(hostname, { family: 4 }, (err, address, family) => {
        callback(err, address, family);
      });
    }
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