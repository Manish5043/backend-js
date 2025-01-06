import {v2 as cloudinary} from "cloudinary"
import fs from "fs";


cloudinary.config({ 
    cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
    api_key: 'process.env.CLOUDINARY_API_KEY', 
    api_secret: 'process.env.CLOUDINARY_API_SECRET' // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (Localfilepath) => {
    try {
        if(!Localfilepath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(Localfilepath, {
            resource_type: "auto"
        })
        //file has been uploaded
        //console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(Localfilepath)
        return response;

    } catch (error) {
        fs.unlinkSync(Localfilepath) // remove the locally 
        // saved temporaray file as the upload opeartion 
        // got failed
        return null;
    }
}

export {uploadOnCloudinary}