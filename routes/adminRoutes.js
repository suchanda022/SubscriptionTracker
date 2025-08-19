const router = require('express').Router();

const  getDashboardStats  = require("../controller/adminController");
const  authMiddleware  = require("../middleware/auth/authMiddleware");
const  adminOnly = require("../middleware/auth/adminCheckMiddleware");

router.get("/dashboard",authMiddleware,adminOnly,getDashboardStats);

module.exports = router;