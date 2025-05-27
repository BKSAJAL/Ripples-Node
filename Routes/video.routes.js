import express from "express";
import { getAllVideos } from "../Controller/video.controller.js";
const router = express.Router();

//Get all videos
router.get("/", getAllVideos);

export default router;
