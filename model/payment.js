
// const mongoose  = require("mongoose");

// const paymentSchema = new mongoose.Schema({


//     // using both user & subscription field for data modelling & faster query convinience
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   subscription: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "subscription",
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   paymentDate: {
//     type: Date,
//     default: Date.now,
//   },
//   dueDate: {
//     type: Date,
//   },
//   paymentMethod: {
//     type: String,
//     enum: ["Card", "UPI", "NetBanking", "Cash", "Other"],
//     default: "Other",
//   },
//   status: {
//     type: String,
//     enum: ["Success",  "Failed","paid"],
//     default: "success",
//   },
//   transactionId: {
//     type: String,
//   },
//   notes: {
//     type: String,
//   },
// });

// const paymentModel = mongoose.model("payment",paymentSchema);
// module.exports = paymentModel;