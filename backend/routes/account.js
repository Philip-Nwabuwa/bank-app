import express from "express";

import {
  deposit,
  transfer,
  accountBalance,
  transactionPerUser,
  transactions,
  createAccount,
} from "../controllers/accountController.js";
import Auth from "../middleware/Auth.js";

const accountRouter = express.Router();

accountRouter.use(Auth);

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

export default accountRouter;
