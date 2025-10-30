import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,      // ton email Gmail
    pass: process.env.SMTP_PASSWORD,   // ton App Password Gmail
  },
});
