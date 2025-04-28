import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (filePath, folder, public_id) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: folder,
      public_id: public_id,
      resource_type: "image",
      format: "png",
    });

    return result;
  } catch (error) {
    throw new Error("Failed to upload image to Cloudinary");
  }
};