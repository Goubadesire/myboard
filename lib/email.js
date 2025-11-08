import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,      // mon email Gmail
    pass: process.env.SMTP_PASSWORD,   // mon App Password Gmail
  },
});
