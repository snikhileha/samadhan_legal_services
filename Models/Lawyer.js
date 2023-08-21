const mongoose = require("mongoose");
const LawyerScehma = new mongoose.Schema(
    {
       name:String,
       catagory:String,
       image:String,
       degree:String,
       experience:String,
       email: { type: String, unique: true },
       password: String,
       user:String
    
       
    },
    {
        collection: "Lawyer",
    }
);
mongoose.model("Lawyer", LawyerScehma);