const express = require("express");
const app = express();
const {adminAuth,userAuth} = require("./middlewares/auth")
//handle auth middleware for all GET,POST,PUT,DELETE request to /admin
app.use("/admin", adminAuth);
app.use("/user/userData",userAuth,
   (req, res) => {
        res.send("Get All User Data");//route handler 
    },
   
);
app.get("/admin/getAllData",//route
   (req, res) => {
        res.send("Get All Data");//route handler 
    },
   
);
app.get("/admin/deleteAllData",//route
   (req, res) => {
        res.send("Deleted All Data");//route handler 
    },
   
);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});