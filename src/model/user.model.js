import { mongoose, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        default: "admin",
        enum: ["user", "admin"],
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

// mongoose middleware to checek if password is modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10);
})

// mongoose method to check if password is correct  this.password is the hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// mongoose method to generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            email: this.email,
            role: this.role
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

// mongoose method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const User = mongoose.model("User", userSchema);