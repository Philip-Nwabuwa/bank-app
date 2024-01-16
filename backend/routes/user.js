import express from "express";
import otpGenerator from "otp-generator";

// controller functions
import {
  loginUser,
  signupUser,
  resetPassword,
} from "../controllers/userController.js";
import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";

export const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

const userRouter = express.Router();

// login route
userRouter.post("/login", loginUser);

// signup route
userRouter.post("/signup", signupUser);

// verfiy OTP
userRouter.get("/verifyOTP", async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    return res.status(400).json({ error: "Please provide OTP and email" });
  }
  try {
    const user = await otpModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    if (otp === user.otp) {
      await otpModel.deleteOne({ email });
      await userModel.updateOne({ email }, { isVerified: true });
      return res.status(200).json({ message: "OTP verified" });
    }
    return res.status(400).json({ error: "Invalid OTP" });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
});

// reset OTP
userRouter.get("/resetOTP", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please provide email" });
  }
  try {
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    await otpModel.deleteOne({ email });
    const otp = generateOTP();
    console.log("OTP ", otp);
    await otpModel.create({
      email,
      otp,
    });
    return res.status(200).json({ message: "OTP resent" });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
});

// reset Password
userRouter.get("/resetPassword", resetPassword);

// generate OTP
userRouter.get("/generateOTP", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  if (!email) {
    return res.status(400).json({ error: "Please provide email" });
  }
  console.log("OTP ", otp);
  await otpModel.deleteOne({ email });

  await otpModel.create({
    email,
    otp,
  });
  return res.status(200).json({ message: "OTP sent" });
});

// verify user
userRouter.get("/verifyUser", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please provide email" });
  }
  try {
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    if (user.isVerified) {
      return res.status(200).json({ message: "User verified" });
    }
    return res.status(400).json({ error: "User not verified" });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
});

export default userRouter;
