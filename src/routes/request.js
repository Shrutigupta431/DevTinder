const express = require("express");
const requestRouter = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("../utils/sendEmail");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
   try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
         return res.status(400).json({
            message: "Invalid status type ", status
         })
      };
      const toUser = await User.findById(toUserId);
      if (toUser)
         if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({ message: "Invalid toUserId" });
         }

      if (!toUser) {
         return res.status(404).json({ message: "User not found " })
      }

      // 
      const existingConnectionRequest = await ConnectionRequest.findOne({
         $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
         ]
      });

      if (existingConnectionRequest) {
         return res.status(400).json({
            message: "Connect Request Already Exist !!"
         })
      };


      const connectionRequest = new ConnectionRequest({
         fromUserId, toUserId, status
      })
      const data = await connectionRequest.save();
      const emailRes = await sendEmail.run(
         "New Connection Request",
         `${req.user.firstName} is ${status} in ${toUser.firstName}`
      );

      console.log(emailRes);
      res.json({
         message: "Connection Send Successfully !!",
         data
      })
   } catch (err) {
      res.status(400).send(err.message)
   }

});
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
   try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const AllowedStatus = ["accepted", "rejected"];

      if (!AllowedStatus.includes(status)) {
         return res.status(400).json({ message: "Status Is Invalid" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
         _id: requestId,
         status: "interested",
         toUserId: loggedInUser._id
      });

      if (!connectionRequest) {
         return res.status(404).json({ message: " Connection Request Not Found !! " })
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({
         message: "Connection Requested " + status,
         data
      })

   } catch (err) {
      res.status(400).send(err.message)
   }

});

module.exports = requestRouter;