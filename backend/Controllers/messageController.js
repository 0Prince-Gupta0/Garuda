import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import asyncHandler from "express-async-handler";

// Send message
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Missing content or chatId" });
  }

  const newMessage = await Message.create({
    sender: req.userId,
    senderModel: req.role === "doctor" ? "Doctor" : "User",
    content,
    chat: chatId,
  });

  const fullMessage = await Message.findById(newMessage._id)
    .populate("sender", "name email")
    .populate({
      path: "chat",
      populate: {
        path: "participants.user",
        select: "name email",
      },
    });

  res.status(201).json(fullMessage);
});


export const allMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  res.status(200).json(messages);
});
