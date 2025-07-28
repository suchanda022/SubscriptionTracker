const { date, string, number } = require("joi");
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
      min: 50,
    },
    frequency: {
      type: String,
      Enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    expireyDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["entertainment", "education", "fitness", "cooking", "others"],
      default: "others",
    },
   user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true
}
    
  },
  {
    timestamps: true,
  }
);

const submodel = mongoose.model("Subscription", subscriptionSchema);
module.exports = submodel;


