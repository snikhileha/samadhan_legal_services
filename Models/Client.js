const mongoose = require("mongoose");
const ClientScehma = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,
        user:String,
        image:String
    },
    {
        collection: "Client",
    }
);
mongoose.model("Client", ClientScehma);