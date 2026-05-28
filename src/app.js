const express = require("express");
const app = express();
const ConnectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const {initializeSocket} = require("./utils/socket");

const http = require("http");

require("dotenv").config();
require("./utils/cronjob");
const cors = require("cors")
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));
app.use(express.json());//it'll work for every request coming to the server; 
//If any incoming request contains JSON data in its body, convert it into a JavaScript object and put it inside req.bodyIf any incoming request contains JSON data in its body, convert it into a JavaScript object and put it inside req.body

app.use(cookieParser())

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const { userRouter } = require("./routes/user");
const chatRouter = require("./routes/chat")
const statusRouter =require("./routes/status");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", statusRouter);
//configuration for socket.io
const server = http.createServer(app);
initializeSocket(server);

// Connect to the database
ConnectDB().then(() => {
    console.log("Connected to the database successfully");

    //changed app.listen ==> server.listen for socket configuration
    const PORT = process.env.PORT || 7777;

    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`Port ${PORT} is already in use. Stop other server instances and retry.`);
            return; // keep nodemon alive without crashing the process
        }
        console.error("Server error:", err);
    });

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to the database:", error);
})


