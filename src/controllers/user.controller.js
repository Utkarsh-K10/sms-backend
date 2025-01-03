import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.js";
import { apiResponse } from "../utils/apiResponse.js"
import { User } from "../model/user.model.js";
import { cloudinaryImageUploader } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

//  get user login detail 
//  validate input fileds
// checek user exists
// password check
// generate token
// send cookies

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiErrorHandler(500, "Something went wrong while generating access and refresh token")
    }
}
const registerUser = asyncHandler(
    async (req, res) => {
        const { username, email, role, password } = req.body;

        if ([username, email, role, password].some((field) => field?.trim() === "")) {
            throw new apiErrorHandler(400, "All fields are required");
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            throw new apiErrorHandler(400, "User with this email or username already exists");
        }
        console.log("req.files:", req.files)

        const avatarLocalPath = req.files?.avatar[0]?.path

        if (!avatarLocalPath) {
            throw new apiErrorHandler(409, "File is required")
        }
        const avatarImage = await cloudinaryImageUploader(avatarLocalPath)

        if (!avatarImage) {
            throw new apiErrorHandler(400, "Avatar is required")
        }

        const user = await User.create(
            {
                username,
                email,
                role,
                password,
                avatar: avatarImage.url
            }
        );

        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            throw new apiErrorHandler(500, "something went wrong");
        }

        return res.status(201).json(
            new apiResponse(200, createdUser, "user created successfuly")
        )
    }
);

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    // if([email, username, password].some((field)=>{field?.trim()===""})){
    //     throw new apiErrorHandler(400, "please enter login credentials");
    // }

    if (!email && !username) {
        throw new apiErrorHandler(400, "please enter email or username");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new apiErrorHandler(404, "User not exists");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apiErrorHandler(400, "Invalid login credentials");
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    // const validUser = user.select("-password -refreshToken");
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                { loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        )

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new apiErrorHandler(401, "Unauthorised Access");
    }

    try {
        const decodedRefreshToken = jwt.decode(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (!decodedRefreshToken) {
            throw new apiErrorHandler(401, "Invalid Refresh Token");
        }

        const user = await User.findById(decodedRefreshToken?.id)

        if (!user) {
            throw new apiErrorHandler(401, "Invalid Refresh Token");
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new apiErrorHandler(401, "Invalid or expired Refresh Token");
        }

        const { accessToken, newRefreshToken } = await generateAccessRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token refreshed successfully"
                )
            )
    } catch (error) {
        throw new apiErrorHandler(401, error?.message || "Invalid Refresh Token");

    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};

