const mongoose = require("mongoose");

const connectDB = async ()=>{
  await  mongoose.connect("mongodb+srv://sg9956855_db_user:lBJ8ERn04etitfir@namastewebcluster.kaqsitb.mongodb.net/")
};

module.exports = connectDB;