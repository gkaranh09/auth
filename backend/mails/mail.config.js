import emailjs from "@emailjs/nodejs";
import dotenv from "dotenv";

dotenv.config();

// Initialize the EmailJS client
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY, // Required for backend to bypass browser checks
});

export const EMAIL_CLIENT = emailjs;
