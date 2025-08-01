const paymentModel = require("../model/payment");
const paymentValidation = require("../validations/paymentValidator");
const asyncHandler = require("express-async-handler");
const { errorhandler, notFound } = require("../middleware/errorHandler");
const simulatePayment = require("../utils/mockPayment");
const submodel  = require("../model/subscriptions");


const createPayment = asyncHandler(async(req,res)=>{
  const {subName} = req.body;

  const userID = req.user._id;

  const sub = await submodel.findOne({subName,user:userID});
  if (!sub) {
     res.status(404).json({ message: "subscription not found for this user" });
  }
  const{amount,_id:subscriptionId} = sub;
 

  const paymentSuccess = await simulatePayment();
  if (!paymentSuccess) return res.status().json({ message: "payment failed" });

  // used create here instead of save because we do not need to change the document after saving
  const payment = await paymentModel.create({
    user: userID,
    subscription : subscriptionId,
    amount,
    status: "paid",
  });
   res.status(200).json({ message: "payment is successful" });
});


const viewPayments = asyncHandler(async(req,res)=>{
  const userId = req.user._id;
  
  const payments = await paymentModel.find({ user:userId })
    //  .select("subscription")  // Customize as needed
    //  .populate("subscription");  // Optional: populate subscription info

  if (payments.length === 0) {
    return res.status(200).json({
      message: "You haven't made any payments yet.",
      payments: [],
    });
  }

  res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });
  

});





module.exports = { createPayment,viewPayments };