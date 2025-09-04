const router = require("express").Router();

const{createSubsciption,fetchSubscription,updateSubscription,deleteSubscription} = require("../controller/subscriptionController");


const authMiddleware = require("../middleware/auth/authMiddleware")

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: API endpoints for managing subscriptions
 */

/**
 * @swagger
 * /sub/add:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subName:
 *                 type: string
 *                 example: "Netflix"
 *               amount:
 *                 type: number
 *                 example: 499
 *               frequency:
 *                 type: string
 *                 example: "monthly"
 *               category:
 *                 type: string
 *                 example: "Entertainment"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-05"
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */


router.post("/add",authMiddleware, createSubsciption);
/**
 * @swagger
 * /sub/showSubs:
 *   get:
 *     summary: Get all subscriptions for the logged-in user
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of subscriptions retrieved successfully
 */
router.get("/showSubs", authMiddleware, fetchSubscription);

/**
 * @swagger
 * /sub/update/{id}:
 *   patch:
 *     summary: Update an existing subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscription
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subName:
 *                 type: string
 *                 example: Spotify
 *               amount:
 *                 type: number
 *                 example: 9.99
 *               category:
 *                 type: string
 *                 example: Music
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-10-15
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 */
router.patch("/update/:id", authMiddleware,updateSubscription);
/**
 * @swagger
 * /sub/delete:
 *   delete:
 *     summary: Delete a subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: 64f28c3c9f1d2a7b19f4d123
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 */
router.delete("/delete",authMiddleware,deleteSubscription);
module.exports = router;