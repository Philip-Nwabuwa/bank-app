import mongoose from "mongoose";
import bcrypt from "bcrypt"
import validator from "validator"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // profile: {
  //   type: String,
  // },
  // firstName: {
  //   type: String,
  // },
  // lastName: {
  //   type: String,
  // },
  // mobile: {
  //   type: String,
  //   required: true,
  // },
  // address: {
  //   type: String,
  // },
  // gender: {
  //   type: String,
  //   default: null,
  //   required: true,
  // },
});

// static signup method
userSchema.statics.signup = async function(email, password) {

  if (!email ||!password) {
    throw Error("Please provide email and password");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is too weak");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already registered");
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({email, password: hash})
  return user
};

export default mongoose.model.Users || mongoose.model("User", userSchema);
