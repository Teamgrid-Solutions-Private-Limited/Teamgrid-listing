const multer = require("multer");
 
const maxSize = 5 * 1024 * 1024; // Maximum file size: 5MB
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Base upload path is defined
    const baseUploadPath = "my-upload/uploads/";
    cb(null, baseUploadPath);
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
});
 
module.exports = upload;
 
 