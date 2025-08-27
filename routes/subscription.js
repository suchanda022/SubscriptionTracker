const router = require("express").Router();

const{createSubsciption,fetchSubscription,updateSubscription,deleteSubscription} = require("../controller/subscriptionController");


const authMiddleware = require("../middleware/auth/authMiddleware")

router.post("/add",authMiddleware, createSubsciption);
router.get("/showSubs", authMiddleware, fetchSubscription);
router.patch("/update/:id", authMiddleware,updateSubscription);
router.delete("/delete",authMiddleware,deleteSubscription);
module.exports = router;