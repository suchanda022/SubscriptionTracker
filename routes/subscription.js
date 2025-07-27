const router = require("express").Router();

const{createSubsciption} = require("../controller/subscriptionController");

const authMiddleware = require("../middleware/auth/authMiddleware")

router.post("/add",authMiddleware, createSubsciption);
module.exports = router;