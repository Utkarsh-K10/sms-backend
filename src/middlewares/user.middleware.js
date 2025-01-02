import { User } from "../model/user.model.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        
        const token = req.cookies?.accessToken || req.headers("Authorization" || "authorization")?.replace("Bearer ", "");

        if(!token){
            throw new apiErrorHandler(401, "Unauthorized Access");
        }

        const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET)
        
        if(!decodedToken){
            throw new apiErrorHandler(401, "Invalid token");
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        req.user = user;
        next()

    } catch (error) {
        throw new apiErrorHandler(401, error?.message || "Invalid Acssess Token"); 
    }
})