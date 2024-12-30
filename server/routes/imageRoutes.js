const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // Import the Multer configuration
const ImageController = require("../controllers/imageController"); // Import your controller

// Define the route for uploading and verifying the image
router.post(
  "/upload-and-verify-image",
  upload.single("image"), // This tells Multer to handle the single file upload for the field "image"
  ImageController.uploadAndVerifyImage // Then pass control to your controller's method
);

module.exports = router;
