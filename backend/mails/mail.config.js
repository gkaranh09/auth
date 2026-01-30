import nodemailer from "nodemailer";
// import dotenv from "dotenv";
import dotenv from "dotenv";

// dotenv.config();
dotenv.config();
console.log("error in main detai", process.env.GMAIL_USER);

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sender = {
  email: process.env.GMAIL_USER,
  name: "Dev Worlds",
};
