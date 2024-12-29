import {mongoose, Schema} from "mongoose";
import bcrypt from "bcrypt";

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

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);