import express from "express";

import {
  deposit,
  transfer,
  accountBalance,
  transactionPerUser,
  transactions,
  createAccount,
  createPin,
  resetPin,
} from "../controllers/accountController.js";
import { verifyUser } from "../controllers/userController.js";
import Auth from "../middleware/Auth.js";

const accountRouter = express.Router();

accountRouter.use(Auth);

// verify user
accountRouter.get("/verify", verifyUser);

//create account
accountRouter.post("/create", createAccount);

// Deposit money into an account
accountRouter.post("/deposit", deposit);

// Transfer money between accounts
accountRouter.post("/transfer", transfer);

// Route to list all transactions
accountRouter.get("/transactions", transactions);

// Route to list transactions for a specific account
accountRouter.get("/usertransactions", transactionPerUser);

// Check account balance
accountRouter.get("/balance", accountBalance);

// create pin
accountRouter.post("/createpin", createPin);

//reset pin
accountRouter.put("/resetpin", resetPin);

export default accountRouter;
