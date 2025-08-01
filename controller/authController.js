const User = require("../model/user.js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const {registerValidation}  = require("../validations/registerValidation");

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


const loginUser = async(req,res)=>{
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });
  if (!userFound) {
    throw new Error("no user found");
  }



  const passwordMatched = await userFound.isPasswordMatched(password);

  if (!passwordMatched) {
    throw new Error("not matched");
  }

  let token = await userFound.generateToken();
  res.json({
    _id: userFound?._id,
    firstName: userFound?.firstName,
    LastName: userFound.lastName,
    email: userFound?.email,
    token,
  });
};
module.exports = { registerUser,loginUser };
