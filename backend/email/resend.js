import { Resend } from "resend";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

import { otpTemplate } from "../email/templates/otp.js";

dotenv.config();

const emailKey = process.env.EMAIL_API_KEY;

if (!emailKey) {
  throw new Error(
    "Missing API key. Set the EMAIL_API_KEY environment variable."
  );
}

const resend = new Resend(emailKey);

export const SendEmailOtp = asyncHandler(async ({ email, otp }) => {
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validEmail.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  const emailHtml = otpTemplate(email, otp);

  try {
    const { data, error } = await resend.emails.send({
      from: "no-reply@philipnwabuwa.online",
      to: email,
      subject: "Verification Code",
      html: emailHtml,
    });
    if (error) {
      throw new Error("Error sending email");
    } else if (data) {
      return { success: true };
    }
  } catch (error) {
    throw new Error("Error sending email from server");
  }
});

export const SendEmailSignup = asyncHandler(async ({ email }) => {
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validEmail.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  try {
    const { data, error } = await resend.emails.send({
      from: "no-reply@philipnwabuwa.online",
      to: email,
      subject: "Signup Email",
      html: `<strong> Welcome to FundFirst Bank </strong>`,
    });
    if (error) {
      throw new Error("Error sending email");
    } else if (data) {
      return { success: true };
    }
  } catch (error) {
    throw new Error("Error sending email from server");
  }
});

export const SendEmailLogin = asyncHandler(async ({ email }) => {
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validEmail.test(email)) {
    throw new Error("Invalid email format");
  }
  try {
    const { data, error } = await resend.emails.send({
      from: "no-reply@philipnwabuwa.online",
      to: email,
      subject: "Login Email",
      html: `<strong> Welcome back to FundFirst Bank </strong>`,
    });
    if (error) {
      throw new Error("Error sending email");
    } else if (data) {
      return { success: true };
    }
  } catch (error) {
    throw new Error("Error sending email from server");
  }
});

export const SendEmailAccountLocked = asyncHandler(async ({ email }) => {
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validEmail.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  try {
    const { data, error } = await resend.emails.send({
      from: "no-reply@philipnwabuwa.online",
      to: email,
      subject: "Security Alert",
      html: `<strong>Your account has detected unusual activity. Please review your account security settings.</strong>`,
    });
    if (error) {
      throw new Error("Error sending email");
    } else if (data) {
      return { success: true };
    }
  } catch (error) {
    throw new Error("Error sending email from server");
  }
});
