const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { userId, propertyId } = req.body; // Extract IDs from request body
    if (!userId || !propertyId) {
      return cb(new Error("User ID and Property ID are required."));
    }

    const userDir = path.join(__dirname, "../my-upload/uploads", `user_${userId}`);
    const propertyDir = path.join(userDir, `property_${propertyId}`);

    // Create directories if they don't exist
    fs.mkdirSync(propertyDir, { recursive: true });
    cb(null, propertyDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Example: image-123456789.jpg
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and JPG files are allowed."));
    }
    cb(null, true);
  },
});

module.exports = upload;


