// const path = require('path');
// const Image = require('../models/imageSchema'); // Image model
// const { getExifData } = require('../utils/exifUtils'); // EXIF utility
// const { calculateDistance } = require('../utils/locationUtils'); // Location utility
// const Property = require('../models/propertySchema'); // Property model

// class ImageController {
//   static uploadAndVerifyImage = async (req, res) => {
//     try {
//       // Extract necessary data from the request body and Multer file
//       const { userId, propertyId } = req.body;
//       const file = req.file; // Multer provides the file in req.file

//       // Get the property location from the Property model using the propertyId
//       const property = await Property.findById(propertyId);
      
//       // Validate request data
//       if (!userId || !propertyId || !property || !property.location || !property.location.coordinates) {
//         return res.status(400).json({ error: "User ID, Property ID, and Property Location (lat, lng) are required." });
//       }

//       // Extract the coordinates (longitude, latitude) from the Property location
//       const [longitude, latitude] = property.location.coordinates;

//       // Validate file upload
//       if (!file) {
//         return res.status(400).json({ error: "No file uploaded." });
//       }

//       // Get the uploaded file path (Multer saves the file in the directory we specified)
//       const imagePath = path.join(__dirname, "../my-upload/uploads", `user_${userId}`, `property_${propertyId}`, file.filename);

//       // Extract EXIF data (location info) from the uploaded image
//       const exifData = await getExifData(imagePath);

//       // If EXIF data is not available, reject the upload
//       if (!exifData || !exifData.latitude || !exifData.longitude) {
//         return res.status(400).json({ error: "No valid EXIF data found in the image." });
//       }

//       // Calculate the distance between the image's location and the provided property location
//       const distance = calculateDistance(
//         latitude,
//         longitude,
//         exifData.latitude,
//         exifData.longitude
//       );

//       // Define the verification threshold (500 meters)
//       const isVerified = distance <= 2000;

//       // Create a new image record in the database
//       const newImage = new Image({
//         userId,
//         propertyId,
//         photo: file.filename,  // Store the uploaded file's name
//         status: isVerified ? 'verified' : 'rejected',  // Set status based on verification result
//       });

//       // Save the image record to the database
//       await newImage.save();

//       // Send back the response based on verification status
//       res.status(201).json({
//         message: isVerified ? "Image uploaded and verified successfully." : "Image uploaded but rejected due to verification failure.",
//         image: newImage,  // Return saved image data
//       });

//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: error.message }); // Handle any server-side errors
//     }
//   };
// }

// module.exports = ImageController;
const fs = require("fs");
const path = require("path");
const Image = require("../models/imageSchema");
const Property = require("../models/propertySchema");
const { getExifData } = require("../utils/exifUtils");
const { calculateDistance } = require("../utils/locationUtils");

class ImageController {
  static uploadAndVerifyImage = async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      const file = req.file;

      // Validate request data
      if (!userId || !propertyId) {
        return res
          .status(400)
          .json({ error: "User ID and Property ID are required." });
      }

      if (!file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      // Get the property location
      const property = await Property.findById(propertyId);
      if (!property || !property.location || !property.location.coordinates) {
        return res
          .status(400)
          .json({ error: "Invalid property or location data." });
      }

      const [longitude, latitude] = property.location.coordinates;

      // Define target upload folder
      const uploadPath = path.join(
        __dirname,
        "../my-upload/uploads",
        `user_${userId}`,
        `property_${propertyId}`
      );

      // Ensure directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Move the uploaded file to the correct folder
      const filePath = path.join(uploadPath, file.filename);
      fs.renameSync(file.path, filePath);

      // Extract EXIF data from the new location
      const exifData = await getExifData(filePath);

      if (!exifData || !exifData.latitude || !exifData.longitude) {
        fs.unlinkSync(filePath); // Delete the file if EXIF data is invalid
        return res.status(400).json({ error: "No valid EXIF data found." });
      }

      // Calculate the distance between EXIF and property location
      const distance = calculateDistance(
        latitude,
        longitude,
        exifData.latitude,
        exifData.longitude
      );

      // Set verification status
      const isVerified = distance <= 2000;

      // Create a new image record
      const newImage = new Image({
        userId,
        propertyId,
        photo: file.filename,
        status: isVerified ? "verified" : "rejected",
      });

      // Save the image record
      await newImage.save();

      res.status(201).json({
        message: isVerified
          ? "Image uploaded and verified successfully."
          : "Image uploaded but verification failed.",
        image: newImage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = ImageController;

