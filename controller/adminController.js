const user = require('../model/user');
const subscription = require('../model/subscriptions');
const asyncHandler = require("express-async-handler");
const User = require('../model/user');
const submodel = require('../model/subscriptions');


const getDashboardStats = asyncHandler(async(req,res)=>{
  const totalUsers = await User.countDocuments();
  const totalSubscriptions = await submodel.countDocuments();
  const activeSubscriptions = await submodel.countDocuments({status:'active'});
   const upcomingRenewals = await  submodel.find({
     expiryDate: {
       $gte: new Date(),
       $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
     },
   }).populate("userId", "name email");

   res.json({
     totalUsers,
     totalSubscriptions,
     activeSubscriptions,
     upcomingRenewals,
   });
   

})
module.exports = getDashboardStats;


