const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String},
    emailId: { type: String},
    password: { type: String},
    age: { type: Number },
    gender: { type: String},

});
//mongoose model name should start with capital letter and should be singular
// const UserModel = mongoose.model("User", userSchema);

// module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);