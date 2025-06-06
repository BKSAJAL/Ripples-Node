import express from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../Controller/user.controller.js";
import authenticateToken from "../Middleware/Auth.js";
import { authLimiter } from "../Middleware/rateLimiters.js";
const router = express.Router();

//Register user
router.post("/register", authLimiter, register);

//Login user
router.post("/login", authLimiter, login);

//Get current user info
router.get("/me", authenticateToken, getCurrentUser);

export default router;
