const Joi = require("joi");

const registerSchema = Joi.object({
    firstName:Joi.string().min(6).required(),
    lastName:Joi.string().required(),
    email:Joi.string().min(6).required().email(),
    phone:Joi.string().min(6).trim().required(),
    password:Joi.string().min(6).required()
});

const registerValidation =(data)=>{
  return  registerSchema.validate(data);
};
module.exports = {registerValidation};


