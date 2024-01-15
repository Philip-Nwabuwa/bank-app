import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import accountRouter from "./routes/account.js";

dotenv.config();

// express app
const app = express();
app.use(cors());
app.disable("x-powered-by");
app.use(morgan("dev"));

// middleware
app.use(express.json());

const port = process.env.PORT || 8000;

// routes
app.get("/", (req, res) => {
  res.status(201).json("Hello Philip!");
});

app.use("/api/user", userRouter);
app.use("/api/account", accountRouter);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(port, () => {
      console.log(
        `connected to db & listening on port http://localhost:${port}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
