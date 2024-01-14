import userModel from "../models/userModel.js";

// login a user
export const loginUser = async (req, res) => {
  res.json({ mssg: "login user" });
};

// signup a user
export const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.signup(email, password);

    res
      .status(200)
      .json({ message: "user successfully registered", email, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
