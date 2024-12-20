const multer = require("multer");
const path = require("path");
const fs = require("fs");

const maxSize = 5 * 1024 * 1024; // Maximum file size (5 MB)

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../my-upload/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_"); // Sanitize filename
    cb(null, `${uniqueSuffix}-${sanitizedFilename}`);
  },
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  const allowedMimetypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/svg+xml",
    "application/pdf",
  ];
  const extension = path.extname(file.originalname).toLowerCase();

  console.log("File mimetype:", file.mimetype);
  console.log("File extension:", extension);

  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only .jpg, .jpeg, .png, .svg, and .pdf formats are allowed!")
    );
  }
};

// Configure multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});

module.exports = upload;
