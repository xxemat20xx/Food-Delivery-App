import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer, folder = "items") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",

        // 🔥 ADD THIS
        transformation: [
          {
            width: 400,
            height: 400,
            crop: "fill",
            gravity: "auto",
          },
          {
            fetch_format: "auto",
            quality: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
