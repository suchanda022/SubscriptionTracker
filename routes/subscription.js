const router = require("express").Router();

const{createSubsciption,fetchSubscription,updateSubscription,deleteSubscription} = require("../controller/subscriptionController");


const authMiddleware = require("../middleware/auth/authMiddleware")

router.post("/add",authMiddleware, createSubsciption);
router.get("/showSubs", authMiddleware, fetchSubscription);
router.patch("/updated/:id", authMiddleware,updateSubscription);
router.delete("/deleted",authMiddleware,deleteSubscription);
module.exports = router;