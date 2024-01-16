import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const emailKey = process.env.EMAIL_API_KEY;

if (!emailKey) {
  throw new Error(
    "Missing API key. Set the EMAIL_API_KEY environment variable."
  );
}

const resend = new Resend(emailKey);

async function registerMail(req, res) {
  const { userEmail, username, subject } = req.body;
  const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Authorization Email</title>
<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}
.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.header {
  background-color: #007bff;
  color: #ffffff;
  padding: 10px;
  text-align: center;
  border-radius: 5px 5px 0 0;
}
.content {
  padding: 20px;
  text-align: center;
}
.footer {
  text-align: center;
  padding: 10px;
  font-size: 0.8em;
  color: #888888;
}
.button {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #28a745;
  color: #ffffff;
  text-decoration: none;
  border-radius: 5px;
}
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${subject}</h1>
    </div>
    <div class="content">
      <p>Hello ${username},</p>
      <p>Your one-time password (OTP) for account access is:</p>
      <h2 style="color: #007bff;">otp</h2>
      <p>Please enter this code on the login page to verify your identity.</p>
      <p class="button">code</p>
      <p>If you did not request this code, please ignore this email or contact support if you have any concerns.</p>
    </div>
    <div class="footer">
      <p>Thank you for using our services!</p>
      <p>Acme Corp</p>
    </div>
  </div>
</body>
</html>`;
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: "Authorization Email",
      html: emailTemplate,
    });

    if (error) {
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export { registerMail };
