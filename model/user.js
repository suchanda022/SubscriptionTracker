const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
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
const User = mongoose.model("User", userSchema);
module.exports = User;