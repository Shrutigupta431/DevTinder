 const adminAuth = (req,res,next)=>{
const token = "admin123";
const authorised=token==="admin123";
if(!authorised){
    res.status(401).send("Unauthorized Admin Access");
}
else{
    next();
}
}
 const userAuth = (req,res,next)=>{
const token = "user123";
const authorised=token==="user123";
if(!authorised){
    res.status(401).send("Unauthorized User Access");
}
else{
    next();
}
}
module.exports ={adminAuth,userAuth}