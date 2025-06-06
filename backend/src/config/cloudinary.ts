import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (!cloudinaryUrl) {
  console.warn(
    'CLOUDINARY_URL not found in .env file. Image uploads will not work.'
  );
  // You might throw an error here or allow the app to run without image upload functionality
  // For now, let's log a warning and proceed. The controllers should handle this gracefully.
} else {
  try {
    cloudinary.config({ cloud_url: cloudinaryUrl, secure: true });
    console.log('Cloudinary configured successfully.');
  } catch (error) {
    console.error('Error configuring Cloudinary:', error);
  }
}


export const uploadToCloudinary = async (filePath: string, folder: string = 'ines_platform_uploads'): Promise<string> => {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error('Cloudinary URL not configured. Cannot upload image.');
  }
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      // transformation: [{ width: 800, height: 600, crop: "limit" }] // Optional: resize images
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
   if (!process.env.CLOUDINARY_URL) {
    throw new Error('Cloudinary URL not configured. Cannot delete image.');
  }
  try {
    // Extract public_id from URL if a full URL is passed
    // Example: http://res.cloudinary.com/demo/image/upload/v12345/folder/image.jpg
    // Public ID: folder/image
    // This regex might need adjustment based on your URL structure and if versioning is part of the URL
    const publicIdPattern = /\/upload\/(?:v\d+\/)?([^.]+)/;
    const match = publicId.match(publicIdPattern);
    const actualPublicId = match ? match[1] : publicId;

    return await cloudinary.uploader.destroy(actualPublicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};


export default cloudinary;
