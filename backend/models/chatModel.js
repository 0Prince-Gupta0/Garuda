import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "participants.model", // dynamic reference
        },
        model: {
          type: String,
          required: true,
          enum: ["User", "Doctor"], // supports both User and Doctor models
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", chatSchema);
