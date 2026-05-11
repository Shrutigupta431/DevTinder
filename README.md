const express = require("express");
const app = express(); //creating new application/server using express framework

//work for /ac & /abc
app.get(/^\/ab?c$/, (req, res) => {
    
    res.send({
        firstName: "John",
        lastName: "Doe"
    });
});
//work for /ac & /abc
app.get(/^\/a(bc)?d$/, (req, res) => {
    res.send({
        firstName: "John",
        lastName: "Doe"
    });
});
//work for /bcd & /bcccccccccccccccd
app.get(/^\/bc+d$/, (req, res) => {
    res.send({
        firstName: "John",
        lastName: "Doe"
    });
});//work for /efgh & /effffffffffffffgh 
app.get(/^\/ef*gh$/, (req, res) => {
    res.send({
        firstName: "John",
        lastName: "Doe"
    });
});
//work for /efgh & /efffffffffdhwjdihddodfffffgh
app.get(/^\/ef.*gh$/, (req, res) => {
    res.send({
        firstName: "John",
        lastName: "Doe"
    });
});
//for query http://localhost:3000/user?id=101&password=Shruu@431
app.get("/user",(req,res)=>{
    console.log(req.query);
    res.send({firstName:"John",lastName:"Doe"});
});
//for params : http://localhost:3000/user/101/shruu
app.get("/user/:userId/:name",(req,res)=>{
    console.log(req.params);
    res.send({firstName:"John",lastName:"Doe"});
});
// app.post("/user",(req,res)=>{
//     res.send("User created successfully!"); //request handler for POST request to /user endpoint
// });
// app.delete("/user",(req,res)=>{
//     res.send("User deleted successfully!"); //request handler for DELETE request to /deleteUser endpoint
// })
// app.use("/hello",(req,res)=>{
//     res.send("Hello from the /hello!"); //request handler for /hello endpoint
// });//this handler will run only if app.use("/",(req,res)=>{ this handler is written below this handler . Order is very important 


// app.use("/",(req,res)=>{
//     res.send("/Hllo!")
// }); //request handler for all incoming requests, sending a response "Hello from the server!"
app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
});

Middleware is one of the MOST important concepts in Express.js.

Simple definition:

Middleware is a function that runs between receiving the request and sending the response.

Real-Life Analogy

Suppose you enter a mall.

Before entering:

Security checks bag
Reception checks ID
Staff guides you

Only then you enter.

These checkpoints are like middleware.
const express = require("express");

const app = express();

const middleware = (req, res, next) => {
    console.log("Middleware executed");

    next();
};

app.use(middleware);

app.get("/", (req, res) => {
    res.send("Home Page");
});

app.listen(3000);