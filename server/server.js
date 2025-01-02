require("dotenv").config();
const express = require("express");
const mongoose = require("./database/connect");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const roleRoute = require("./routes/roleRoutes");
const inquiryRoute =require("./routes/inquiryRoute");
const propertyRoute =require("./routes/propertyRoutes");
const favouriteRoute =require("./routes/favouriteRoute");
const searFilterRoute =require("./routes/searchFilterRoutes");
const notificationRoute =require("./routes/notificationRoute");
const adminactivityRoute =require("./routes/adminactivityRoute");
const path = require("path")

const errorHandler = require("./middlewares/errorHandler");


const PORT = process.env.PORT || 4000;
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "my-upload/uploads")));

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/role", roleRoute);
app.use("/api/v1/inquiry", inquiryRoute);
app.use("/api/v1/property",propertyRoute);
app.use("/api/v1/favourite",favouriteRoute);
app.use("/api/v1/favourite",searFilterRoute);
app.use("/api/v1/favourite",notificationRoute);
app.use("/api/v1/adminactivity",adminactivityRoute);

// Error handler (must be the last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
