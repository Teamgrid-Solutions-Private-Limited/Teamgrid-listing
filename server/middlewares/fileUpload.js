
// module.exports = upload;
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const maxSize = 5 * 1024 * 1024; // Maximum file size: 5MB

// Multer configuration for storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = "my-upload/images/"; // Default directory

    // Customize the upload directory based on the request route
    if (req.baseUrl.includes("/users")) {
      uploadDir = "my-upload/uploads/users"; // Directory for user uploads
    } else if (req.baseUrl.includes("/teams")) {
      uploadDir = "my-upload/uploads/teams"; // Directory for team uploads
    } else if (req.baseUrl.includes("/sponsors")) {
      uploadDir = "my-upload/uploads/sponsors"; // Directory for sponsor uploads
    }

    // Ensure the directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedFilename = file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueSuffix + sanitizedFilename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/svg+xml",
      "application/pdf",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .jpg, .jpeg, .png, .svg formats are allowed"));
    }
  },
  limits: { fileSize: maxSize },
})


 


module.exports =  upload ;
