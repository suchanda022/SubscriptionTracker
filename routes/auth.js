const router = require('express').Router();

const {
  registerUser,
  loginUser,
  editCredits,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const authMiddleware = require("../middleware/auth/authMiddleware");
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully
 *               user:
 *                 id: 648d7d1f2c7a5d44d8d8b123
 *                 firstName: Mini
 *                 lastName: Sharma
 *                 email: user@example.com
 *                 phone: 5678990345
 *       400:
 *         description: Validation error (e.g. email already exists)
 *         content:
 *           application/json:
 *             example:
 *               message: Email already exists
 */






router.post('/register',registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: sneha@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               _id: "68b9ded3a0eccf9ef80280d"
 *               firstName: "Sneha"
 *               lastName: "Chakraborty"
 *               email: "sneha@gmail.com"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid email or password"
 */

router.post('/login',loginUser);
/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Update user credentials (requires authentication)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: User credentials updated successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 * 
 */



 router.put("/update", authMiddleware, editCredits);

 router.post("/forgot-password",forgotPassword);       //using post because involves sending sensitive information
 router.post("/reset-password/:token",resetPassword);




 module.exports = router;

