const express = require("express");

const User =
  require("../models/user");

const statusRouter =
  express.Router();

// IMPORT ONLINE USERS MAP
const {
  onlineUsers,
} = require("../utils/socket");

// USER STATUS
statusRouter.get(
  "/user-status/:userId",
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const user =
        await User.findById(
          userId
        );

      // CHECK ONLINE
      const isOnline =
        onlineUsers.has(
          userId
        );

      res.status(200).json({

        isOnline,

        lastSeen:
          user?.lastSeen,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          err.message,
      });
    }
  }
);

module.exports =
  statusRouter;