const express = require("express");
const ConnectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validateHandler = require("./utils/validate");
const bcrypt = require("bcrypt");
app.use(express.json());//it'll work for every request coming to the server;

//signup API to create a new user
app.post("/signup", async (req, res) => {
    try {
        validateHandler(req);
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

//get user by email id
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Error while fetching user : " + err.message);
    }
})

//feed API to get all the users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Error while fetching user : " + err.message);
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (deletedUser) {
            res.send("User deleted successfully");
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(400).send("Error while deleting user : " + err.message);
    }
});
//update the data 
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const updateData = req.body;
    try {
        const ALLOWED_UPDATES = ["age", "skills", "gender", "photoUrl", "about"];
        const isUpdateAllowed = Object.keys(updateData).every((key) => ALLOWED_UPDATES.includes(key));
        if (!isUpdateAllowed) {
            throw new Error("Updates Not ALlowed");
        };
        if (updateData.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
        const updatedUser = await User.findByIdAndUpdate({ _id: userId }, updateData, { returnDocument: "after", runValidators: true });
        console.log("Updated user data:", updatedUser); // Log the updated user data
        if (updatedUser) {
            res.send("User updated successfully");
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(400).send("Error while updating user : " + err.message);
    }
})
// Connect to the database
ConnectDB().then(() => {
    console.log("Connected to the database successfully");

    app.listen(7777, () => {
        console.log("Server is running on port 3000");
    });
}).catch((error) => {
    console.error("Error connecting to the database:", error);
})

