const router = require("express").Router();
const {createPayment} = require("../controller/paymentController");

const authMiddleware = require("../middleware/auth/authMiddleware");

router.post("/makePayment",authMiddleware,createPayment);

module.exports = router;