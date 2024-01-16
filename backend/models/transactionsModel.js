import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["deposit", "withdrawal", "transfer"],
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
    default: "",
  },
  recipientuserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model.transactions ||
  mongoose.model("Transaction", transactionSchema);
