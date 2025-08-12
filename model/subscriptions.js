
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    subName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 19,
    },
    frequency: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    expirey: {
      type: Date,
    },
    category: {
      type: String,
      enum: ["entertainment", "education", "fitness", "cooking", "others"],
      default: "others",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,

    }
  },
  {
    timestamps: true,
  }
);

const submodel = mongoose.model("Subscription", subscriptionSchema);
module.exports = submodel;


