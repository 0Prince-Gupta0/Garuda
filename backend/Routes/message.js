// routes/messageRoutes.js
import express from "express";
import { sendMessage, allMessages } from "../Controllers/messageController.js";
import { authenticate } from "../auth/verifyToken.js";

const router = express.Router();

// POST /api/message -> Send a message
router.post("/", authenticate, sendMessage);

// GET /api/message/:chatId -> Fetch all messages of a chat
router.get("/:chatId", authenticate, allMessages);

export default router;
