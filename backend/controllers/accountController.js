import dotenv from "dotenv";
import Account from "../models/accountModel.js";
import Transaction from "../models/transactionsModel.js";
dotenv.config();

export const createAccount = async (req, res) => {
  const generateAccountNumber = () => {
    const randomDigits = Math.floor(Math.random() * 1e8)
      .toString()
      .padStart(8, "0");
    return "99" + randomDigits;
  };
  const isAccountNumberUnique = async (accountNumber) => {
    // Check if the account number already exists in the database
    const account = await Account.findOne({ accountNumber: accountNumber });
    return !account;
  };
  try {
    const userId = req.user._id;
    const existingAccount = await Account.findOne({ userId: userId });
    if (existingAccount) {
      return res.status(400).send("User already has an account");
    }
    let accountNumber;
    let unique = false;

    while (!unique) {
      accountNumber = generateAccountNumber();
      unique = await isAccountNumberUnique(accountNumber);
    }
    console.log(accountNumber);
    // Create a new account
    const account = await Account.create({
      userId: userId,
      accountNumber: accountNumber,
      balance: 0,
    });

    if (!account) {
      return res.status(400).send("Error creating account");
    }

    res.send({ message: "Account created successfully", account });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during the account creation");
  }
};

export const deposit = async (req, res) => {
  try {
    const depositAmount = req.body.amount;
    const details = req.body.details;
    const userId = req.user._id;

    const activeAccount = await Account.findOne({ userId: userId });

    if (!activeAccount) {
      return res.status(400).send("User does not have an account");
    }

    const transaction = await Transaction.create({
      userId: userId,
      accountNumber: activeAccount.accountNumber,
      type: "deposit",
      amount: depositAmount,
      details: details,
      status: "completed",
    });

    const account = await Account.findOneAndUpdate(
      { userId: userId },
      {
        $inc: { balance: depositAmount },
        $push: { transactions: transaction._id },
      },
      { new: true }
    );

    console.log(transaction._id);

    res.send({
      message: "Deposit successful",
      newBalance: account.balance,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during the deposit");
  }
};

export const transfer = async (req, res) => {
  try {
    const transferAmount = req.body.amount;
    const details = req.body.details;
    const recipient = req.body.recipient;
    const userId = req.user._id;

    const activeAccount = await Account.findOne({ userId: userId });
    const AccountNumber = activeAccount.accountNumber;

    if (!activeAccount || !activeAccount.accountNumber) {
      return res.status(400).send("User does not have an account");
    }

    const recipientAccount = await Account.findOne({
      accountNumber: recipient,
    });

    if (!recipientAccount || !recipientAccount.accountNumber) {
      return res.status(400).send("Recipient does not have an account");
    }

    const RecipientAccountNumber = recipientAccount.accountNumber;

    if (RecipientAccountNumber === AccountNumber) {
      return res.status(400).send("You cannot transfer to the same account");
    }

    if (activeAccount.balance < transferAmount) {
      return res.status(400).send("Insufficient funds");
    }

    const transaction = await Transaction.create({
      userId: userId,
      recipientuserId: recipientAccount._id,
      type: "transfer",
      amount: transferAmount,
      details: details,
      status: "completed",
    });

    const account = await Account.findOneAndUpdate(
      { userId: userId },
      {
        $inc: { balance: -transferAmount },
        $push: { transactions: transaction._id },
      },
      { new: true }
    );

    const recipientAccountUpdated = await Account.findOneAndUpdate(
      { accountNumber: recipient },
      {
        $inc: { balance: transferAmount },
        $push: { transactions: transaction._id },
      },
      { new: true }
    );
    res.send({
      message: "Transfer successful",
      newBalance: account.balance,
      transaction,
      recipientAccountUpdated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during the transfer");
  }
};

export const transactions = async (req, res) => {
  const transactionsList = await Transaction.find();
  res.send(transactionsList);
};

export const accountBalance = async (req, res) => {
  const userId = req.user._id;
  const account = await Account.findOne({ userId: userId });
  if (!account) {
    return res.status(400).send("User does not have an account");
  } else {
    const balance = account.balance;
    res.send({ message: "Account balance", balance });
  }
};

export const transactionPerUser = async (req, res) => {
  const userId = req.user._id;

  const transactionsList = await Transaction.find({ userId: userId });

  res.send(transactionsList);
};
