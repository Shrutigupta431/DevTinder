const express = require("express");
const app = express();


app.use("/user",//route
  [  (req, res,next) => {
        // res.send("Route Handler 1:");//route handler 
        next();
    },
    (req, res,next) => {
        // res.send("Route Handler 2: ");//route handler 
        next();
    },
     (req, res) => {
        res.send("Route Handler 3: ");//route handler 
    },]
);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});