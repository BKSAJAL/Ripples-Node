import express from "express";
import { createChannel, getChannel } from "../Controller/channel.controller.js";
import authenticateToken from "../Middleware/Auth.js";
const router = express.Router();

//Get Channel
router.get("/get", authenticateToken, getChannel);

//Add channel
router.post("/create", authenticateToken, createChannel);

export default router;
