import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const tokenENV = process.env.JWT_SECRET;

if (!tokenENV) {
  throw Error("JWTPASSWORDSECRET is not set");
}

const createToken = (_id) => {
  return jwt.sign({ _id }, tokenENV, { expiresIn: "1h" });
};

// login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    console.log(user);
    await userModel.updateOne({ email }, { loginAttempts: 0 });
    const token = createToken(user._id);
    return res.status(200).json({
      message: "Login successful",
      token,
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
};

// signup a user
export const signupUser = async (req, res) => {
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

    res.status(200).json({ message: "user successfully registered" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  const { otp, password, email } = req.body;
  if (!otp || !password || !email) {
    return res
      .status(400)
      .json({ error: "Please provide OTP, password and email" });
  }
  try {
    const user = await otpModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    if (otp === user.otp) {
      await otpModel.deleteOne({ email });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await userModel.updateOne(
        { email },
        {
          password: hash,
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
};
