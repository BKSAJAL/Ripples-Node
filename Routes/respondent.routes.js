import express from "express";
import {
  getRespondents,
  getRespondentById,
} from "../Controller/respondent.controller.js";
import authenticateToken from "../Middleware/Auth.js";
const router = express.Router();

//Get all respondents for authenticated user
router.get("/", authenticateToken, getRespondents);

// Get detailed information about a specific respondent.
router.get("/:id", authenticateToken, getRespondentById);

export default router;
