import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const cloudinaryUploader = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null // return null if no file is uploaded or throw an error
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "image",
        })
        fs.unlinkSync(localFilePath); // delete the file after uploading
        console.log(response.secure_url)
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath); // delete the file if an error occurs
        return null
    }
}

const cloudinaryImageRemover = async (targetUrl) => {
    try {
        if(!targetUrl){
            return null // return null if no file is uploaded or throw an error
        }
        const response = await cloudinary.uploader.destroy(targetUrl)
        return response

    } catch (error) {
        throw new Error(error.message)
    }
}

export { cloudinaryUploader, cloudinaryImageRemover };