import express from "express";
import {
  getMyMessages,
  getUnreadMessageCount,
  markConversationRead,
  sendMessage,
} from "../controllers/message.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);
router.get("/my", verifyToken, getMyMessages);
router.get("/unread-count", verifyToken, getUnreadMessageCount);
router.post("/mark-read", verifyToken, markConversationRead);

export default router;
