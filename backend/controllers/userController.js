import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
    const token = createToken(user._id);
    return res.status(200).json({
      message: "Login successful",
      token,
      user,
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
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await userModel.signup(email, password);

    res
      .status(200)
      .json({ message: "user successfully registered", email, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
