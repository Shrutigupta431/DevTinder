const express = require("express");
const app = express(); //creating new application/server using express framework

app.use("/hello/2",(req,res)=>{
    res.send("Hello/2"); //this handler will run only if app.use("/hello",(req,res)=>{ this handler is written below this handler .
});
app.use("/hello",(req,res)=>{
    res.send("Hello from the /hello!"); //request handler for /hello endpoint
});//this handler will run only if app.use("/",(req,res)=>{ this handler is written below this handler . Order is very important 


app.use("/",(req,res)=>{
    res.send("/Hllo!")
}); //request handler for all incoming requests, sending a response "Hello from the server!"
app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
});