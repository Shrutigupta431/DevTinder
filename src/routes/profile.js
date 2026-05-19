const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validate");
const User = require("../models/user");

//profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {

        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error while fetching user profile : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        //    res.send("Profile updated successfully");
        res.json({ message: `${loggedInUser.firstName},Your profile updated successfully`, data: loggedInUser });
    } catch (err) {
        res.status(400).send("Error while updating profile : " + err.message);
    }
});

module.exports = profileRouter;