import express from "express";

import {
  loginUser,
  signupUser,
  resetPassword,
  verifyUser,
  generateotp,
  verifyOTP,
  resetOTP,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  resetPasswordWithAuth,
} from "../controllers/userController.js";
import Auth from "../middleware/Auth.js";

const userRouter = express.Router();

// login route
userRouter.post("/login", loginUser);

// signup route
userRouter.post("/signup", signupUser);

// logout user
userRouter.post("/logout", logoutUser);

// verfiy OTP
userRouter.get("/verifyOTP", verifyOTP);

// reset OTP
userRouter.get("/resetOTP", verifyUser, resetOTP);

// reset Password without authentication
userRouter.put("/resetPassword", resetPassword);

// reset Password with authentication
userRouter.put("/resetpasswordAuth", Auth, resetPasswordWithAuth);

// verify user then generate otp
userRouter.get("/generateotp", verifyUser, generateotp);

// verify user
userRouter.post("/verifyUser", verifyUser);

// updat User
userRouter.put("/updateUser", Auth, updateUserDetails);

//get user details
userRouter.get("/getUserDetails", Auth, getUserDetails);

export default userRouter;
