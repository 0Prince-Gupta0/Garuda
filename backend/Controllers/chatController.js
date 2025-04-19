import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import asyncHandler from "express-async-handler";

export const accessChat = asyncHandler(async (req, res) => {
  const { reUserId, reUserModel } = req.body;

  if (!reUserId || !reUserModel) {
    return res.status(400).json({ message: "Receiver user ID and model are required." });
  }

  const currentUserId = req.userId;
  const currentUserModel = req.role === "doctor" ? "Doctor" : "User";
  const recModel = reUserModel === "doctor" ? "Doctor" : "User";

  try {
    const chat = await Chat.findOne({
      participants: {
        $all: [
          { $elemMatch: { user: currentUserId, model: currentUserModel } },
          { $elemMatch: { user: reUserId, model: recModel } },
        ],
      },
    }).populate({
      path: "participants.user",
      select: "-password",
    });

    if (chat) {
      const messages = await Message.find({ chat: chat._id })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });

      return res.status(200).json({ chat, messages });
    }

    const createdChat = await Chat.create({
      chatName: "Chat",
      participants: [
        { user: currentUserId, model: currentUserModel },
        { user: reUserId, model: recModel },
      ],
    });

    const fullChat = await Chat.findById(createdChat._id).populate({
      path: "participants.user",
      select: "-password",
    });

    return res.status(200).json({ chat: fullChat, messages: [] });
  } catch (error) {
    console.error("Error accessing chat:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
