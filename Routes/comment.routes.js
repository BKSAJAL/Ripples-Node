import express from "express";
import {
  addComment,
  updateComment,
  removeComment,
} from "../Controller/comment.controller.js";
import authenticateToken from "../Middleware/Auth.js";
const router = express.Router();

//Add new comment
router.post("/addComment/:id", authenticateToken, addComment);

//Update comment
router.put("/updateComment/:id", updateComment);

//Delete comment
router.delete("/deleteComment/:id", removeComment);

export default router;
