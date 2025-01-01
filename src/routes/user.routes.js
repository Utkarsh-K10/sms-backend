import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
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


export default userRouter;