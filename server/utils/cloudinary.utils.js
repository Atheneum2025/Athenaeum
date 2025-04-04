const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_KEY_SECRET,
});

const uploadOnCloudinary = async (localFilePath, size) => {
  const imageExtensions = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG", ".gif", ".bmp", ".tiff"];
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".flv",
    ".webm",
    ".wmv",
  ];
  const documentExtensions = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".drawio"];
  try {
    if (!localFilePath) {
      return null;
    }
    let type = "auto";
    const fileExtension = path.extname(localFilePath);
    console.log(`File extension : ${fileExtension}`);
    

    if (imageExtensions.includes(fileExtension)) {
      type = "image";
    } else if (videoExtensions.includes(fileExtension)) {
      type = "video";
    } else if (documentExtensions.includes(fileExtension)) {
      type = "raw";
    } else {
      type = "auto";
    }
    let response;
    if (type == "image") {
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "image"
      });
    } else if (type == "video") {
      if(size > 104857600){
        response = await cloudinary.uploader.upload_large(localFilePath, {
          resource_type: "video",
        });
      }
      else{
        response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "video",
        });
      }
    } else {

      
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "raw",
        access_mode: "public",
      });
    }
    if (!response) {
      throw new Error("Upload failed. No response from Cloudinary.");
    }
    console.log(response);
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File not found: ${localFilePath}`);
    }
  
    // remove the file from local uploads folder
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

module.exports = {
  uploadOnCloudinary,
};