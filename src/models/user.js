const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 2, maxLength: 100 },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true, lowercase: true, trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address");
            }
        }
     },
    password: { type: String, required: true },
    age: { type: Number, min: 18 },
    gender: { type: String,
        validate(value){
            if(!["male","female","others"].includes(value.toLowerCase())){
                throw new Error("Gender must be valid")
            }
        },lowercase: true, trim: true
     },
    photoUrl: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png", validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url"+error.message);
            }
        } },
    skills: { type: [String] },
    about: { type: String, default: " Hey there! I'm using DevConnect." },

}, { timestamps: true });

userSchema.methods.getJWT = async function(){
   const user = this;
    const token = await  jwt.sign({_id:user._id}, "SHruu@431",{expiresIn:"7d"});
    return token;
};
userSchema.methods.validatePassword = async function(passwordByUser){
   const user = this;
   const passHash = user.password;
    const isValidPass = await  bcrypt.compare(passwordByUser,passHash);
    return isValidPass;
}
//mongoose model name should start with capital letter and should be singular
// const UserModel = mongoose.model("User", userSchema);

// module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);