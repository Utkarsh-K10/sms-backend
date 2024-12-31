import { asyncHandler} from "../utils/asyncHandler.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.js";
import { apiResponse} from "../utils/apiResponse.js"
import { User } from "../model/user.model.js";
import { cloudinaryImageUploader } from "../utils/cloudinary.js";

//  get user detail 
//  validate input fileds
// checek user exists
// get avtar local path from multer and validate
// update user into database

const registerUser = asyncHandler(
    async (req, res) => {
        const { username, email, role, password } = req.body;

        if([username, email, role, password].some((field)=> field?.trim()==="")){
            throw new apiErrorHandler(400, "All fields are required");
        }

        const existedUser = await User.findOne({
            $or: [{username}, {email}]
        })

        if(existedUser){
            throw new apiErrorHandler(400, "User with this email or username already exists");
        }
        console.log(req.files)

        const avatarLocalPath = req.files?.files[0]?.path 

        if(!avatarLocalPath){
            throw new apiErrorHandler(409, "File is required")
        }
        const avatarImage = await cloudinaryImageUploader(avatarLocalPath)

        if(!avatarImage){
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

        if(!createdUser){
            throw new apiErrorHandler(500, "something went wrong");
        }

        return res.status(201).json(
            new apiResponse( 200, createdUser, "user created successfuly")
        )
    }
);


export { registerUser };    