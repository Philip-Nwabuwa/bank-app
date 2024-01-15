import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

const Auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ error: "Please provide an authorization header" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(_id).select(`_id`);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default Auth;
