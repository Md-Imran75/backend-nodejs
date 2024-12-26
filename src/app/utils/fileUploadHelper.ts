import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET  
});


const uploadFile = async (filePath : string) => {
  try {
    if(!filePath) return "File path is required";
    const response = await cloudinary.uploader.upload(filePath, {
        resource_type: "image",
    })
    return response.url; 
  } catch (error) {
    fs.unlinkSync(filePath);
    return error;
  }
}

export default uploadFile;