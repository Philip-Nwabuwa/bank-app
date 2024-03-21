import dotenv from "dotenv";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import { generateOTP } from "../helper/generateOTP.js";
import generateToken from "../helper/generateTokens.js";
import {
  SendEmailLogin,
  SendEmailOtp,
  SendEmailSignup,
} from "../email/resend.js";

dotenv.config();
const tokenKey = process.env.JWT_SECRET;

// login a user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }
  try {
    const user = await userModel.login(email, password);
    if (user.isLocked) {
      return res
        .status(400)
        .json({ error: "Account locked. Please reset your password." });
    } else {
      await userModel.updateOne({ email }, { loginAttempts: 0 });
      generateToken(res, user._id);
      // SendEmailLogin({ email });
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
    }
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred during login",
      details: error.message,
    });
  }
});

export const loginUserWithoutPassword = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!otp || !email) {
    return res.status(400).json({ error: "Please provide OTP and email" });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid user" });
  }

  try {
    const userOTP = await otpModel.findOne({ email });
    if (!userOTP) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }
    const validOTP = otp === userOTP.otp;
    console.log("validOTP", validOTP);
    if (otp === userOTP.otp) {
      await otpModel.deleteOne({ email });
      console.log(user._id);
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
          dob: user.dob,
          createdAt: user.createdAt,
        },
      });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error during login" });
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
    dob,
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
      gender,
      dob
    );
    const user = await userModel({ email });
    await SendEmailSignup({ email });
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
  const { password, email } = req.body;
  if (!password || !email) {
    return res.status(400).json({ error: "Please provide password and email" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);
      await userModel.updateOne(
        { email },
        {
          password: newPassword,
          isLocked: false,
          loginAttempts: 0,
        }
      );
      return res
        .status(200)
        .json({ message: "Password reset, proceed to login" });
    } else {
      return res.status(400).json({ error: "Error during reset" });
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

export const verifyUser = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          isAuthenticated: false,
          error: "Token verification failed",
          details: err.message,
        });
      }
      res.json({ isAuthenticated: true, user: decoded });
    });
  } catch (error) {
    console.error("Unexpected error in verifyUser:", error);
    res.status(500).json({
      error: "An unexpected error occurred during verification",
      details: error.message,
    });
  }
});

export const emailCheck = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please provide email" });
  }
  try {
    const user = await userModel.findOne({ email });
    console.log(user);
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    return res.status(200).json({ message: "Proceed" });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
});

export const emailLoginCheck = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please provide email" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(200).json({ message: "Proceed" });
    }
    return res
      .status(404)
      .json({ error: "User not found, Proceed to create an account." });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
});

export const generateotp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  if (!otp) {
    return res.status(400).json({ error: "OTP generation failed, try again" });
  }
  if (!email) {
    return res.status(400).json({ error: "Please provide email" });
  }
  console.log("OTP ", otp);
  try {
    const result = await SendEmailOtp({ email, otp });
    if (result.success) {
      await otpModel.deleteOne({ email });
      await otpModel.create({ email, otp });
      return res.status(200).json({ message: "OTP sent" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export const resetOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  if (!otp) {
    return res.status(400).json({ error: "OTP generation failed, try again" });
  }
  if (!email) {
    return res.status(400).json({ error: "Please provide email" });
  }
  try {
    const result = await SendEmailOtp({ email, otp });
    if (result.success) {
      await otpModel.deleteOne({ email });
      await otpModel.create({ email, otp });
      return res.status(200).json({ message: "OTP resent" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Unexpected error in getAllUsers:", error);
  }
});
