const paymentModel = require("../model/payment");
const paymentValidation = require("../validations/paymentValidator");
const asyncHandler = require("express-async-handler");
const { errorhandler, notFound } = require("../middleware/errorHandler");
const simulatePayment = require("../utils/mockPayment");
const submodel  = require("../model/subscriptions");


const createPayment = asyncHandler(async(req,res)=>{
 const {subscription} = req.body;

 const userID = req.user._id;

 const sub = await submodel.findById(subscription);
 if(!sub){
    return res.status(404).json({message:"subscription not found"});

 }
 if (sub.user.toString() !== userID.toString()) {
    return res.status(404).json({message:"user didn't match"});
 } 
 const frequency = sub.frequency;
 const amount = sub.amount ;

 const paymentSuccess = await simulatePayment();
 if(!paymentSuccess) return res.status().json({message:"payment failed"});

 
 const payment = await paymentModel.create({  // used create here instead of save because we do not need to change the document after saving
    user : userID,
    subscription,
    amount,
    paymentDate,
    status:"completed",
 });
 return res.status(200).json({ message: "payment created" });

  
});


module.exports = { createPayment };