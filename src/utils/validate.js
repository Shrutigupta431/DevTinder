const validator = require("validator");

const validateHandler = (req) => {
   const {firstName, lastName, emailId, password, age} = req.body;
    if(!firstName ||!lastName){
        throw new Error("Name is required");
    }else if(!(validator.isEmail(emailId))){
        throw new Error("Invalid email address");
    }else if(!password || password.length<6){
        throw new Error("Password must be at least 6 characters long");
    }else if(age && (age<18 || age>100)){
        throw new Error("Age must be between 18 and 100");
    }
 };
 module.exports = validateHandler;