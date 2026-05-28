const express = require("express");

const { userAuth } = require("../middlewares/auth");

const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get(
  "/chat/:targetUserId",
  userAuth,
  async (req, res) => {

    const { targetUserId } = req.params;

    const userId = req.user._id;

    try {

      let chat = await Chat.findOne({
        participants: {
          $all: [userId, targetUserId],
        },
      }).populate({
        path:"messages.senderId",
        select :"firstName lastName"
      });

      // CREATE CHAT IF NOT EXISTS
      if (!chat) {

        chat = new Chat({
          participants: [userId, targetUserId],
          messages: [],
        });

        await chat.save();
      }

      res.status(200).json(chat);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message,
      });
    }
  }
);
// GET UNREAD COUNTS
chatRouter.get(
  "/unread-counts",
  userAuth,
  async (req, res) => {

    try {

      const userId =
        req.user._id;

      const chats =
        await Chat.find({
          participants: userId,
        }).populate(
          "participants",
          "firstName lastName photoUrl"
        );

      const unreadCounts =
        chats.map((chat) => {

          // OTHER USER
          const targetUser =
            chat.participants.find(
              (p) =>
                p._id.toString() !==
                userId.toString()
            );

          // COUNT UNREAD
          const unreadCount =
            chat.messages.filter(
              (msg) =>

                msg.senderId.toString() !==
                  userId.toString()

                &&

                !msg.seenAt
            ).length;

          return {

            targetUserId:
              targetUser?._id,

            firstName:
              targetUser?.firstName,

            lastName:
              targetUser?.lastName,

            photoUrl:
              targetUser?.photoUrl,

            unreadCount,
          };
        });

      res.status(200).json(
        unreadCounts
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          err.message,
      });
    }
  }
);

module.exports = chatRouter;