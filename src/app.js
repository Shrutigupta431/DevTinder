const express = require("express");
const app = express();

//Error handling in express js 
app.get("/user",
   (req, res) => {
    try{
throw new Error("User Authentication FAiled");
        res.send("Get All User Data");//route handler 
    }catch(err){
res.status(500).send("Something Went Wrong contact with support team")
    }
    
    },
   
);
app.use("/",(err,reqq,res,next)=>{
    if(err){
        res.status(500).send("Something Went Wrong" )
    }
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});