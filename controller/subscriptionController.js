const submodel = require("../model/subscriptions");
  const { errorhandler, notFound } = require("../middleware/errorHandler");
const asyncHandler = require("express-async-handler");
const validSubscription = require("../validations/subscriptionValidation");
const {calculateExpiryDate,getStatus} = require("../utils/calculateexpiry");

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
    expirey : expiry,
    status:getStatus
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
  const { search,status,category,minAmount,maxAmount } = req.query; // optional

  // base query
  let query = { user: _id };


  const filters = {  // basically object.assign merges them in mongodb query 
    ...(status && {status}),
    ...(category && {category}),
     ...(minAmount && maxAmount && { amount: { $gte: Number(minAmount), $lte: Number(maxAmount) } }),
  }
  Object.assign(query,filters);

  // if search term is given, add OR condition for name and category
  if (search && search.trim() !== "") {
    query.$or = [
      { subName: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  const found = await submodel.find(query);

  if (!found || found.length === 0) {
    return res.status(404).json({message:"not found"});
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
