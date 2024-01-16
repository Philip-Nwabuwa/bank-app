import dotenv from "dotenv";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";

import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import { generateOTP } from "../helper/generateOTP.js";
import generateToken from "../helper/generateTokens.js";

dotenv.config();

const tokenENV = process.env.JWT_SECRET;

if (!tokenENV) {
  throw Error("JWTPASSWORDSECRET is not set");
}

// login a user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    await userModel.updateOne({ email }, { loginAttempts: 0 });
    generateToken(res, user._id);
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        image: user.image,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        gender: user.gender,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred during login",
      details: error.message,
    });
  }
});

// signup a user
export const signupUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    image,
    firstName,
    lastName,
    mobile,
    address,
    gender,
  } = req.body;
  try {
    await userModel.signup(
      email,
      password,
      image,
      firstName,
      lastName,
      mobile,
      address,
      gender
    );
    const user = await userModel({ email });
    generateToken(res, user._id);
    console.log(user);
    res.status(200).json({ message: "user successfully registered" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({ message: "User logged out" });
});

// reset password without authentication
export const resetPassword = asyncHandler(async (req, res) => {
  const { otp, password, email } = req.body;
  if (!otp || !password || !email) {
    return res
      .status(400)
      .json({ error: "Please provide OTP, password and email" });
  }
  try {
    const user = await otpModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    if (otp === user.otp) {
      await otpModel.deleteOne({ email });
      await userModel.updateOne(
        { email },
        {
          password,
          isLocked: false,
          loginAttempts: 0,
        }
      );
      return res
        .status(200)
        .json({ message: "Password reset, proceed to login" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// reset password with authentication
export const resetPasswordWithAuth = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Please provide old password and new password" });
  }
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid old password" });
    }
    await userModel.updateOne(
      { _id: req.user._id },
      {
        password: newPassword,
        isLocked: false,
        loginAttempts: 0,
      }
    );
    return res.status(200).json({ message: "Password reset" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get userdetails
export const getUserDetails = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

// update user details
export const updateUserDetails = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);

  if (user) {
    user.address = req.body.address || user.address;
    user.image = req.body.image || user.image;
    user.updatedAt = Date.now();

    const updatedUser = await user.save();
    res.status(200).json({
      message: "User details updated successfully",
    });
  } else {
    return res.status(400).json({ error: "User not found" });
  }
});

export const verifyUser = asyncHandler(async (req, res, next) => {
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
    next();
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
});

export const generateotp = asyncHandler(async (req, res) => {
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

export const resetOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please provide email" });
  }
  try {
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

export const verifyOTP = asyncHandler(async (req, res) => {
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
