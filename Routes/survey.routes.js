import express from "express";
import {
  getSurveys,
  createSurvey,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  publishSurvey,
  getPublicSurvey,
  submitSurveyResponse,
  getSurveyResponses,
} from "../Controller/survey.controller.js";
import authenticateToken from "../Middleware/Auth.js";
import { surveyResponseLimiter } from "../Middleware/rateLimiters.js";
const router = express.Router();

//Get list of survey
router.get("/", authenticateToken, getSurveys);

//Create a new survey
router.post("/", authenticateToken, createSurvey);

//Get survey by id
router.get("/:id", authenticateToken, getSurveyById);

//Update survey
router.put("/:id", authenticateToken, updateSurvey);

//Delete survey
router.delete("/:id", authenticateToken, deleteSurvey);

//Publish survey
router.post("/:id/publish", authenticateToken, publishSurvey);

//Get public survey
router.get("/:id/public", getPublicSurvey);

//Submit a survey response
router.post("/:id/responses", surveyResponseLimiter, submitSurveyResponse);

//Get all responses for a survey
router.get("/:id/responses", authenticateToken, getSurveyResponses);

export default router;
