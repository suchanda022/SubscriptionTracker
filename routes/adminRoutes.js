const router = require('express').Router();

const  getDashboardStats  = require("../controller/adminController");
const  authMiddleware  = require("../middleware/auth/authMiddleware");
const  adminOnly = require("../middleware/auth/adminCheckMiddleware");

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Returns statistics including total users, subscriptions, active subscriptions, and upcoming renewals. Requires admin authentication.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 120
 *                 totalSubscriptions:
 *                   type: integer
 *                   example: 450
 *                 activeSubscriptions:
 *                   type: integer
 *                   example: 300
 *                 upcomingRenewals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64a6b8f5e4f23cabc12345ef
 *                       expiryDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-09-11T00:00:00Z
 *                       userId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 64a6b8f5e4f23cabc12345ef
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                           email:
 *                             type: string
 *                             example: john@example.com
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Only admins can access this route
 */

router.get("/dashboard",authMiddleware,adminOnly,getDashboardStats);

module.exports = router;