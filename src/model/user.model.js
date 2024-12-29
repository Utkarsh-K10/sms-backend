import {mongoose, Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    role:{
        type: String,
        default: "admin",
        enum: ["user", "admin"],
    },    
    password:{
        type: String,
        required: true,
        trim: true,
    }
},{timestamps: true});

export const User = mongoose.model("User", userSchema);