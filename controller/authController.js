const User = require("../model/user.js");
const bcrypt = require('bcrypt');

const {registerValidation}  = require("../validation");

const registerUser = async(req,res)=>{
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExist = await  User.findOne({email : req.body.email});
    if(emailExist){
      return res.status(400).send('Email already exists');
    }
    const phoneExist = await  User.findOne({phone : req.body.phone});
    if(phoneExist){
      return res.status(400).send('number already exists');
    }

   

   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone:req.body.phone,
      password: hashedPassword,
    });
   
  try {
    const savedUser = await user.save();
    res.send({user: savedUser._id});
    
  } catch (error) {
    res.status(400).send(error);
    
  }
   
   


 


};
module.exports = { registerUser };
