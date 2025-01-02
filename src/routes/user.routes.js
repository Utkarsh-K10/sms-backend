import { Router } from "express";
import { 
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const userRouter =  Router();


userRouter.route('/').get((req, res) => {
    res.json({message: "Welcome to user route"});
})

userRouter.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
);
userRouter.route('/login').post(loginUser)


// secured route
userRouter.route('/logout').post(verifyJWT, logoutUser)
userRouter.route('/refresh-token').post(refreshAccessToken)
userRouter.route('/carusel').post(verifyJWT,)

export default userRouter;