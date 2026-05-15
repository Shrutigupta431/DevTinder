const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendconnectrequest", userAuth, async (req, res) => {
    const user = req.user;
    console.log("Sending a connection request from user:", user.firstName);
    res.send(user.firstName + " : sent you a connection request !");
});

module.exports = requestRouter;