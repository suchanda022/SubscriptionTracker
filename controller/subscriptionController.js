const submodel = require("../model/subscriptions");
const {errorhandler,notFound} = require("../middleware/errorHandler");
const asyncHandler = require("express-async-handler")
const validSubscription = require("../validations/subscriptionValidation");
const { subscribe } = require("../routes/auth");


const createSubsciption = asyncHandler(async (req, res) => {
    const{ subName,amount,frequency, expireyDate,category} = req.body;
    // extracting the id part from the user 
    const {_id} = req.user;

    const subscription = new submodel({
        subName,
        amount,
        frequency,
        expireyDate,
        category,
        user : _id

       
    });

    const createdSub = await subscription.save();

    res.status(201).json({
        message: "subscription created successfully",
        
       // subscription: createdSub // this will make appearance in the endpoint as per schema model
    });





});

module.exports = { createSubsciption };
