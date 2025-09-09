const User = require("../model/user.js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { errorhandler, notFound } = require("../middleware/errorHandler");
const asyncHandler = require("express-async-handler");

const {registerValidation}  = require("../validations/registerValidation");
const sendEmail = require("../utils/sendEmails.js");
const crypto = require("crypto");


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
    res.status(200).json({
      message: "user registered successfully",
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        phone: savedUser.phone,
      },
    });
    
    
  } catch (err) {
    next(err);
    
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


const editCredits = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const updated = await User.findByIdAndUpdate(
    userId,
    {
      $set: req.body, // only safe if you're validating input before this
    },
    { new: true, runValidators: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "Credentials updated successfully",
    user:updated
  });
});


// ------------------ FORGOT PASSWORD ------------------
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate raw token
  const resetToken = crypto.randomBytes(32).toString("hex");
  // Hash token before storing in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save hashed token and expiry
  user.resetToken = hashedToken;
  user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send the **raw token** in the reset link
  const resetUrl = `${process.env.FRONTEND_URL}/api/auth/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    templateName: "resetPassword.html",
    placeholders: {
      name: user.firstName,
      resetUrl,
    },
  });

  res.json({ message: "Reset email sent successfully" });
});

// ------------------ RESET PASSWORD ------------------
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash incoming token to match stored hashed token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with matching token and valid expiry
  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Clear reset token fields
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.json({ message: "Password has been reset successfully" });
});

module.exports = {
  forgotPassword,
  resetPassword,
};

module.exports = {
  registerUser,
  loginUser,
  editCredits,
  forgotPassword,
  resetPassword,
};
