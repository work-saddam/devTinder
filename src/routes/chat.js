const express = require("express");
const chatRouter = express.Router();
const Chat = require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    const connection = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId: userId,
          toUserId: targetUserId,
          status: "accepted",
        },
        {
          fromUserId: targetUserId,
          toUserId: userId,
          status: "accepted",
        },
      ],
    });

    if (!connection) {
      return res
        .status(403)
        .json({ error: "You can only chat with your connections" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: "",
      });
      await chat.save();
    }

    res.status(200).json({ chat });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = chatRouter;
