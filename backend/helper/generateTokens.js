import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = process.env.JWT_SECRET;
  if (!token) {
    return res.status(400).json({ error: "JWT_SECRET not found" });
  }
  const accessToken = jwt.sign({ userId }, token, {
    expiresIn: "1h",
  });
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60,
  });
};

export default generateToken;
