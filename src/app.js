const express = require("express");
const app = express(); //creating new application/server using express framework

app.use((req,res)=>{
    res.send("Hello buddy!")
}); //request handler for all incoming requests, sending a response "Hello from the server!"

app.use("/hello",(req,res)=>{
    res.send("Hello from the /hello endpoint!"); //request handler for /hello endpoint
});
app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
});