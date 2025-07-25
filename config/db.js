const mongoose = require("mongoose");

const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("db is connect successfully");
  } catch (error) {
    console.log(`Error ${error.message}`);
  }
};
module.exports = dbconnect;
