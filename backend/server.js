import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRouter from "./routes/user.js";
import accountRouter from "./routes/account.js";

import { notFound, errorHandler } from "./middleware/error.js";

dotenv.config();

// connect to db
connectDB();

// express app
const app = express();
app.use(cors());
app.disable("x-powered-by");
app.use(morgan("dev"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.status(201).json("Hello Philip!");
});

app.use("/api/user", userRouter);
app.use("/api/account", accountRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
