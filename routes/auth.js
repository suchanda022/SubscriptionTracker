const router = require('express').Router();

const {registerUser,loginUser,updateCredentials} = require("../controller/authController");
const authMiddleware = require("../middleware/auth/authMiddleware");





router.post('/register',registerUser);
router.post('/login',loginUser);
router.put('/update',authMiddleware,updateCredentials);


module.exports = router;

