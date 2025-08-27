const router = require('express').Router();
const {
  getSpendingTracks,
  getCategoryBreakdown,
  statusStats
} = require("../controller/analysticsController");
const authMiddleware = require("../middleware/auth/authMiddleware");


router.get("/spending-track",authMiddleware,getSpendingTracks);
router.get("/category-breakdown", authMiddleware, getCategoryBreakdown);
router.get("/status-stats",authMiddleware,statusStats);


module.exports = router ;







