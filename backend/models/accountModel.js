import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  bankName: {
    type: String,
    required: true,
    default: "FundFirst",
  },
  accountNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0.0,
  },
  pin: {
    type: String,
  },
  pinAttempts: {
    type: Number,
    default: 0,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transactions",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model.Accounts ||
  mongoose.model("Account", accountSchema);
