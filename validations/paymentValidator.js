const Joi = require("joi");
const mongoose = require("mongoose");

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const paymentValidation = Joi.object({
  user: Joi.string().custom(isValidObjectId).required(),
  subscription: Joi.string().custom(isValidObjectId).required(),
  amount: Joi.number().positive().required(),
  paymentDate: Joi.date(), // optional, defaults in schema
  dueDate: Joi.date().optional(),
  paymentMethod: Joi.string()
    .valid("Card", "UPI", "NetBanking", "Cash", "Other")
    .default("Other"),
  status: Joi.string().valid("Paid", "Pending", "Failed").default("Paid"),
  transactionId: Joi.string().optional(),
  notes: Joi.string().optional(),
});

module.exports = paymentValidation;
