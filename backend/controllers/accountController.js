import dotenv from "dotenv";
import bcrypt from "bcrypt";

import Account from "../models/accountModel.js";
import Transaction from "../models/transactionsModel.js";
import userModel from "../models/userModel.js";

dotenv.config();

export const createAccount = async (req, res) => {
  console.log(req.user);
  if (!req.user || !req.user._id) {
    return res.status(400).send("User not found");
  }
  const userId = req.user._id;

  const existingAccount = await Account.findOne({ userId: userId });
  if (existingAccount) {
    return res.status(400).send("User already has an account");
  }
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

    if (!depositAmount || !details) {
      return res.status(400).send("Please provide amount and details");
    }

    if (depositAmount <= 0) {
      return res.status(400).send("Amount must be greater than 0");
    }

    if (depositAmount > 10000000) {
      return res.status(400).send("Amount must be less than 10,000,000");
    }

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
    const pin = req.body.pin;
    const bank = req.body.bankName;
    const transferAmount = req.body.amount;
    const details = req.body.details;
    const recipient = req.body.recipient;
    const userId = req.user._id;

    const activeAccount = await Account.findOne({ userId: userId });
    const AccountNumber = activeAccount.accountNumber;

    if (!activeAccount || !activeAccount.accountNumber) {
      return res.status(400).send("User does not have an account");
    }

    if (!bank) {
      return res.status(400).send("Please provide the bank name");
    }

    if (!pin) {
      return res.status(400).send("Please provide your pin");
    }
    const pinString = pin.toString();

    if (!activeAccount.pin) {
      return res.status(400).send("Please set your pin");
    }

    const dbPin = activeAccount.pin;

    const validPin = await bcrypt.compare(pinString, dbPin);

    if (!validPin) {
      activeAccount.pinAttempts += 1;
      if (activeAccount.pinAttempts >= 5) {
        activeAccount.isLocked = true;
        await activeAccount.save();

        return res.status(400).send("Pin locked, please do a reset");
      }

      await activeAccount.save();

      return res.status(400).send("Invalid pin");
    } else {
      if (activeAccount.isLocked) {
        return res.status(400).send("Pin locked, please do a reset");
      } else {
        activeAccount.pinAttempts = 0;
        await activeAccount.save();
      }
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
      bankName: bank,
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

export const createPin = async (req, res) => {
  const userId = req.user._id;
  const pin = req.body.pin;
  const pinString = pin.toString();
  console.log(pin);
  if (!pinString || pinString.length !== 4) {
    return res.status(400).send("Pin must be 4 digits");
  }
  const activeAccount = await Account.findOne({ userId: userId });
  console.log(activeAccount);
  if (!activeAccount) {
    return res.status(400).send("User does not have an account");
  }
  const existingPin = await Account.findOne({ pin: pinString });
  console.log(existingPin);
  if (existingPin) {
    return res.status(400).send("User already has a pin");
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pinString, salt);
    await Account.findOneAndUpdate(
      { userId: userId },
      { pin: hash },
      { new: true }
    );
    res.send({ message: "Pin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during the pin creation");
  }
};

// reset Pin
export const resetPin = async (req, res) => {
  const userId = req.user._id;
  const password = req.body.password;
  const pin = req.body.pin;

  if (!password) {
    return res.status(400).send("Please provide your password");
  }

  const user = await userModel.findOne({ _id: userId });
  if (!user) {
    return res.status(400).send("User does not exist");
  }

  const pass = user.password;
  const validPassword = await bcrypt.compare(password, pass);
  if (!validPassword) {
    return res.status(400).send("Invalid password");
  }

  if (!pin) {
    return res.status(400).send("Please provide your pin");
  }
  const pinString = pin.toString();

  if (!pinString || pinString.length !== 4) {
    return res.status(400).send("Pin must be 4 digits");
  }
  const activeAccount = await Account.findOne({ userId: userId });
  console.log(activeAccount);
  if (!activeAccount) {
    return res.status(400).send("User does not have an account");
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pinString, salt);
    await Account.findOneAndUpdate(
      { userId: userId },
      { pin: hash, pinAttempts: 0, isLocked: false },
      { new: true }
    );
    res.send({ message: "Pin updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during the pin creation");
  }
};
