import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import OTP from "../models/otpModel.js";
import { generateOTP } from "../routes/user.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: null,
    required: true,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// static signup method
userSchema.statics.signup = async function (
  email,
  password,
  image,
  firstName,
  lastName,
  mobile,
  address,
  gender
) {
  console.log(email);
  if (!email || !password) {
    throw new Error("Please provide email and password");
  }

  if (!firstName) {
    throw new Error("Please provide first name");
  }

  if (!lastName) {
    throw new Error("Please provide last name");
  }

  if (!mobile) {
    throw new Error("Please provide mobile number");
  }

  if (!gender) {
    throw new Error("Please provide gender");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is too weak");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("Email already registered");
  }

  const mobileExists = await this.findOne({ mobile });

  if (mobileExists) {
    throw new Error("Mobile number already registered");
  }

  const otp = generateOTP();
  console.log("OTP ", otp);

  await OTP.create({
    email,
    otp,
  });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    image,
    firstName,
    lastName,
    mobile,
    address,
    gender,
  });
  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("Please provide email and password");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("User does not exist");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      // Lock the user account
      user.isLocked = true;
      await user.save();

      throw new Error("Account locked. Please reset your password.");
    }

    await user.save();

    throw new Error("Invalid credentials");
  }

  return user;
};

export default mongoose.model.Users || mongoose.model("User", userSchema);
