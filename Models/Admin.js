const mongoose = require("mongoose");
const AdminScehma = new mongoose.Schema(
    {
       name:String,
       image:String,
       secretKey:String,
       email: { type: String, unique: true },
       password: String,
       user:String
    
       
    },
    {
        collection: "Admin",
    }
);
mongoose.model("Admin", AdminScehma);