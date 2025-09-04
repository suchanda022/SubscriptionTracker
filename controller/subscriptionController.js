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
    expirey: expiry,
    status: getStatus(expiry)   // call the function  , dont  pass the function it self 
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
  const { search,status,category,minAmount,maxAmount,sortBy,sortOrder,page = 1, limit = 10} = req.query; 
  const pageNumber = Math.max(1,parseInt(page) ||1);
  const pageSize = Math.min(50,Math.max(1,parseInt(limit) || 10));
  const skip = (pageNumber - 1) * pageSize;

  // base query
  let query = { user: _id };


  const filters = {
    // basically object.assign merges them in mongodb query
    ...(status && { status }),
    ...(category && { category }),
    ...(minAmount && {
      amount: { ...(query.amount || {}), $gte: Number(minAmount) },
    }),
    ...(maxAmount && {
      amount: { ...(query.amount || {}), $lte: Number(maxAmount) },
    }),
  };
  Object.assign(query,filters);

  // if search term is given, add OR condition for name and category
  if (search && search.trim() !== "") {
    query.$or = [
      { subName: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }
  let sort =  {createdAt:-1};
   if (sortBy) {
       sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }
  

const[subscriptions,totalCount]=  await Promise.all([submodel.find(query).sort(sort).skip(skip).limit(pageSize).lean(),
  submodel.countDocuments(query)
])

  if (!subscriptions || totalCount === 0) {
    return res.status(404).json({message:"not found"});
  }
  const totalPages = Math.ceil(totalCount/pageSize);
  const hasNextpage = pageNumber < totalPages;
  const hasprevPage = pageNumber>1;

  res.status(200).json({
    message: "Subscriptions fetched successfully",
    data: {
      subscriptions,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalCount,
        pageSize,
        hasNextpage,
        hasprevPage,
        startIndex: skip + 1,
        endIndex: Math.min(skip + pageSize, totalCount),
      }
    }
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
