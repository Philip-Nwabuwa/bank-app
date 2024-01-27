import express from "express";

import {
  loginUser,
  signupUser,
  resetPassword,
  generateotp,
  verifyOTP,
  resetOTP,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  resetPasswordWithAuth,
  emailCheck,
  emailLoginCheck,
  loginUserWithoutPassword,
} from "../controllers/userController.js";
import Auth from "../middleware/Auth.js";

const userRouter = express.Router();

// login route
userRouter.post("/login", loginUser);

// loginwithoutPassword
userRouter.post("/loginwithoutPassword", loginUserWithoutPassword);

// signup route
userRouter.post("/signup", signupUser);

// logout user
userRouter.post("/logout", logoutUser);

// verfiy OTP
userRouter.post("/verifyOTP", verifyOTP);

// reset OTP
userRouter.post("/resetOTP", resetOTP);

// reset Password without authentication
userRouter.put("/resetPassword", resetPassword);

// reset Password with authentication
userRouter.put("/resetpasswordAuth", Auth, resetPasswordWithAuth);

// verify user then generate otp
userRouter.post("/generateotp", generateotp);

// updat User
userRouter.put("/updateUser", Auth, updateUserDetails);

// validate email
userRouter.post("/emailcheck", emailCheck);

//check login email
userRouter.post("/verifyLoginEmail", emailLoginCheck);

//get user details
userRouter.get("/getUserDetails", Auth, getUserDetails);

export default userRouter;
