const Joi = require("joi");


const subscriptionSchema = Joi.object({
  subName: Joi.string().required() ,
  amount: Joi.number().required().min(50) ,
  frequency: Joi.string()
  .valid("daily","weekly","monthly","yearly")
  .required() ,
  expireyDate: Joi.date().iso().required()   ,
  category: Joi.string()
  .valid("entertainment","education","productivity","fitness","other")
  .default("other")    ,
 

});

const validSubscription = (data) => {
  return subscriptionSchema.validate(data);
};
module.exports = { validSubscription };   