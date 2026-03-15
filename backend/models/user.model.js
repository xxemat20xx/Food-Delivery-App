import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["customer", "staff", "admin"],
        default: "customer"
    },
    location:{
        lat: Number,
        lng: Number,
    }
}, {timestamp: true});

export default mongoose.model("User", userSchema);