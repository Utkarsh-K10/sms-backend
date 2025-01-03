import { Carousal } from "../model/carousal.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.js";
import { cloudinaryImageUploader } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";


const uploadCarousal = asyncHandler(async (req, res) =>{
    try {

        const title = req.body.title;
        if (!title) {
            throw new apiErrorHandler(409, "Title is required")
        }

        const files = req.files;
    
        if(!files || files.length === 0){
            throw new apiErrorHandler(409, "File is required")
        }

        let carousalLocalPaths = files.map(file => file.path);
        // if(req.files && Array.isArray(req.files.carousalImage) && req.files.carousalImage.length > 0)
        //     {
        //         carousalLocalPaths = req.files
        //     }
    
        console.log("carousalLocalPaths:", carousalLocalPaths)
    
        if (!carousalLocalPaths) {
            throw new apiErrorHandler(409, "File path is required")
        }
        
        
        // const createdcarousal = await Carousal.create(
        //     {title, carousalImage: carousalImagespath?.url || ""}
        // )
        
        if (!createdcarousal) {
            throw new apiErrorHandler(500, "something went wrong while creating carousal");
        }
    
        return res
        .status(201)
        .json(
            new apiResponse(
                201,
                createdcarousal, 
                "carousal created")
            )
    } catch (error) {
        throw new apiErrorHandler(500, "something went wrong while creating carousal");
    }
});


export { uploadCarousal }
