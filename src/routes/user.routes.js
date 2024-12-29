import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const userRouter =  Router();


userRouter.route('/').get((req, res) => {
    res.json({message: "Welcome to user route"});
})

userRouter.route('/register').post(registerUser);

export default userRouter;