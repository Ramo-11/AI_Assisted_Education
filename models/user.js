const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String, 
        required: true 
    },
    gender: {
        String
    },
    role: {
        type: String,
        enum: ["student", "teacher"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{ collection: "users" }
)

const userModel = mongoose.model("UserSchema", UserSchema)

module.exports = userModel