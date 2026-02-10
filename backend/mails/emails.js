import { EMAIL_CLIENT } from "./mail.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

/**
 * Universal helper function to send emails via EmailJS.
 * This assumes your EmailJS Template (the one with ID in .env) has 3 variables:
 * 1. {{user_email}}  - The recipient's email
 * 2. {{subject}}     - The email subject line
 * 3. {{{html_message}}} - The full HTML content (note the TRIPLE curly braces in dashboard)
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await EMAIL_CLIENT.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID, // Ensure this ID is in your .env file
      {
        user_email: to,
        subject: subject,
        html_message: htmlContent,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendverificationEmail = async (email, verificationToken) => {
  try {
    // Replace the placeholder in your HTML template
    const html = VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken,
    );

    // Send using the universal helper
    const response = await sendEmail(email, "Verify your email", html);

    console.log("Verification email sent successfully", response.text);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error Sending Verification Email: ${error.message}`);
  }
};

export const welcomeEmail = async (name, email) => {
  try {
    const html = WELCOME_EMAIL_TEMPLATE.replace("{name}", name);

    const response = await sendEmail(email, "Welcome to Dev World", html);

    console.log("Welcome email sent successfully", response.text);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error in Sending Welcome Message: ${error.message}`);
  }
};

export const sendPasswordResetMail = async (email, resetURL) => {
  try {
    const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      "{resetURL}",
      resetURL,
    );

    const response = await sendEmail(email, "Reset Your Password", html);

    console.log("Password reset email sent successfully", response.text);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error(`Error in Sending password reset email: ${error.message}`);
  }
};

export const successResetPasswordEmail = async (email) => {
  try {
    const html = PASSWORD_RESET_SUCCESS_TEMPLATE;

    const response = await sendEmail(email, "Password Reset Successful", html);

    console.log("Password reset success email sent", response.text);
  } catch (error) {
    console.error("Error sending reset success email", error);
    throw new Error(
      `Error in sending Success of reset password: ${error.message}`,
    );
  }
};
