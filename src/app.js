const express = require("express");
const app = express();

const ConnectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());//it'll work for every request coming to the server;
app.use(cookieParser())

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const {userRouter} = require("./routes/user");
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)
// Connect to the database
ConnectDB().then(() => {
    console.log("Connected to the database successfully");

    app.listen(7777, () => {
        console.log("Server is running on port 3000");
    });
}).catch((error) => {
    console.error("Error connecting to the database:", error);
})

