import { Router } from "express";
import { verifyJWT } from "../middlewares/user.middleware.js";
import { uploadCarousal } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const adminRouter = Router();

adminRouter.route('/carousal').post(
    // upload.fields([
    //     {
    //         name: "carousalImage",
    //         maxCount: 1
    //     }
    // ]),
    upload.array("carousalImage",3),
    verifyJWT,
    uploadCarousal
)
export default adminRouter;