const submodel = require("../model/subscriptions");
  const { errorhandler, notFound } = require("../middleware/errorHandler");
const asyncHandler = require("express-async-handler");
const validSubscription = require("../validations/subscriptionValidation");
const calculateExpiryDate = require("../utils/calculateexpiry");

const createSubsciption = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { subName, amount, frequency, category,startDate } = req.body;
  // extracting the id part from the user

  const exists = await submodel.findOne({
  user: userId, 
  subName: subName.trim().toLowerCase() 
 

  });
  if(exists) return res.status(400).json({message:"duplicate subscription"});
  const expiry =  calculateExpiryDate(startDate,frequency);

  const subscription = new submodel({
    subName,
    amount,
    frequency,
    category,
    startDate,
    user: userId,
    expirey : expiry
  });


  const createdSub = await subscription.save();

  res.status(201).json({
    message: "subscription created successfully",
    subscription:createdSub

    // subscription: createdSub // this will make appearance in the endpoint as per schema model
  });
});

const fetchSubscription = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const found = await submodel.find({ user: _id });
  
  if (!found) {
    const error = new Error("subscription not found");
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json({
    message: "Subscriptions fetched successfully",
    subscription: found,
  });
});

const updateSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
 
  console.log(userId);
  const updated = await submodel.findOneAndUpdate(
    { _id : id, user: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) {
    return res.status(404).json({ message: "Subscription not found" });
  }
  res.status(200).json({
    message: "it's updated",
    subscription: updated,
  });

  re
});

const deleteSubscription = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const userId = req.user._id;

  const deleted = await submodel.findByIdAndDelete({ _id: id, user: userId });
  if (!deleted) {
    return res.status(404).json({ message: "not authorized to delete" });
  }
  res.status(200).json({
    message: "subscription deleted",
    subscription: deleted,
  });
});

module.exports = {
  createSubsciption,
  fetchSubscription,
  updateSubscription,
  deleteSubscription,
};
