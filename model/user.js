const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { string } = require("joi");


const userSchema = new mongoose.Schema({
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'

  },
  firstName: {
    required: [true, "first name is rquired"],
    type: String,
  },
  lastName: {
    required: [true, "last name is required"],
    type: String,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    max: 1024,
    min: 6,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
  }
 
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_KEY, { expiresIn: "20d" });
};
const User = mongoose.model("User", userSchema);
module.exports = User;