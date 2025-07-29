const paymentModel = require("../model/payment");
const paymentValidation = require("../validations/paymentValidator");
const asyncHandler = require("express-async-handler");
const { errorhandler, notFound } = require("../middleware/errorHandler");



const createPayment = asyncHandler(async(req,res)=>{
 const userId = req.user._id;
 const {} = req.user;
 
  




  
});


module.exports(createPayment);