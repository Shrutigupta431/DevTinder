const express = require("express");
const ConnectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    //Creating the new instance of the user model and saving it to the database
    const user = new User({
        firstName: "AKshay",
        lastName: "Kumar",
        emailId: "hello@gmail.com",
        password: "123456",
        // age: 30,
        // gender: "Male"
    })
    try{

        res.send("User Added Successfully !");
        await user.save();
    }catch(err){
        res.status(400).send("Error while adding the user : " + err.message);
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

