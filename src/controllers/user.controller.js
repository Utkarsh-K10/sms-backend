import { asyncHandler} from "../utils/asyncHandler";
import { apiErrorHandler } from "../utils/apiErrorHandler";
import { apiResponse} from "../utils/apiResponse"
import { User } from "../model/user.model";

const registerUser = asyncHandler(
    async (req, res) => {
        const { username, email, role, password } = req.body;

        if([username, email, role, password].some((field)=> field?.trim()==="")){
            throw new apiErrorHandler(400, "All fields are required");
        }

        const existedUser = await User.findone({
            $or: [{username}, {email}]
        })

        if(existedUser){
            throw new apiErrorHandler(400, "User with this email or username already exists");
        }

        const user = await User.create(
            { username, email, role, password}
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