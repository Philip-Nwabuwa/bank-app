export const otpTemplate = (email, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background-color: #0275d8;
          color: #ffffff;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .email-body {
          padding: 20px;
          text-align: center;
        }
        .email-footer {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>FundFirst Bank</h1>
        </div>
        <div class="email-body">
        <p>Hello, ${email}</p>
          <p><strong>Your OTP:</strong> ${otp}</p>
          <p>Please use the above One-Time Password to verify your email.</p>
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} FundFirst Bank. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
};
