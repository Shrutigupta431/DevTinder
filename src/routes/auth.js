const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {validateSignupData} = require("../utils/validate");
const bcrypt = require("bcrypt");


//signup API to create a new user
authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, emailId, password, age } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        //Creating the new instance of the user model and saving it to the database
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age
        });
        res.send("User Added Successfully !");
        await user.save();
    } catch (err) {
        res.status(400).send("Error while adding the user : " + err.message);
    }
})

//login API 

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials !!")
        }
        const isValidPassword = await user.validatePassword(password);
        if (isValidPassword) {
            //create the JWT token 
            const token = await user.getJWT();
            if (!token) {
                throw new Error("Token Expired");
            }
            //send the cookie 
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true });
            res.send("User Login SuccessFully !");
        } else {
            throw new Error("Invalid credentials !!");
        }

    } catch (err) {
        res.status(400).send("Error while logging in the user : " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(0), httpOnly: true });
        res.send("User logged out successfully !");
    } catch (err) {
        res.status(400).send("Error while logging out the user : " + err.message);
    }
});

module.exports = authRouter;