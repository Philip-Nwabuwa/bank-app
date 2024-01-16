import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

const Auth = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({
        error: "Access Denied",
        message: "Not authorized, token expired",
      });
    }
  } else {
    return res.status(401).json({
      error: "Access Denied",
      message: "Not authorized, no token provided",
    });
  }
};

export default Auth;
