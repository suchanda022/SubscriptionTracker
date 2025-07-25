const router = require('express').Router();
const User = require("../model/user");
const {registerUser} = require("../controller/authController");




router.post('/register',registerUser);


module.exports = router;

