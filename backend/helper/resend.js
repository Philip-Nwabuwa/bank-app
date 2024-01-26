import { Resend } from "resend";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();

const emailKey = process.env.EMAIL_API_KEY;

if (!emailKey) {
  throw new Error(
    "Missing API key. Set the EMAIL_API_KEY environment variable."
  );
}

const resend = new Resend(emailKey);

const SendEmailOtp = asyncHandler(async ({ email, otp }) => {
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validEmail.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  try {
    const { data, error } = await resend.emails.send({
      from: "no-reply@philipnwabuwa.online",
      to: email,
      subject: "Authorization Email",
      html: `<strong> Your OTP: ${otp}  </strong>`,
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

export default SendEmailOtp;
