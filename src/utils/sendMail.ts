import nodemailer from "nodemailer";
import { envConfig } from "../configs/envConfig";

interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendMail = async (mailOptions: MailOptions) => {
  const transporter = nodemailer.createTransport({
    host: envConfig.SMTP.HOST,
    port: envConfig.SMTP.PORT,
    secure: false,
    auth: {
      user: envConfig.SMTP.USER,
      pass: envConfig.SMTP.PASS,
    },
  });

  const info = await transporter.sendMail({
    from: mailOptions.from || `Digital Wallet <${envConfig.SMTP.FROM}>`,
    to: mailOptions.to,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,
  });

  return info;
};

export default sendMail;
