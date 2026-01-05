import { transporter, sender } from "./mail.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

export const sendverificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });
    console.log("Verification email sent successfully", response.messageId);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error Sending Verification Email: ${error.message}`);
  }
};

export const welcomeEmail = async (name, email) => {
  try {
    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Welcome to Dev World",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
    console.log("Welcome email sent successfully", response.messageId);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error in Sending Welcome Message: ${error.message}`);
  }
};

export const sendPasswordResetMail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Password reset email sent successfully", response.messageId);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error(`Error in Sending password reset email: ${error.message}`);
  }
};

export const successResetPasswordEmail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent", response.messageId);
  } catch (error) {
    console.error("Error sending reset success email", error);
    throw new Error(
      `Error in sending Success of reset password: ${error.message}`
    );
  }
};
