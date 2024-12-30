const express = require("express");
const AdminActivityController = require("../controllers/adminactivityController");
const router = express.Router();

// Log an Admin Activity
router.post("/log", AdminActivityController.logActivity);

// Get All Admin Activities (with optional filters)
router.get("/", AdminActivityController.getActivities);

// Get Activity by ID
router.get("/:id", AdminActivityController.getActivityById);

// Delete an Admin Activity
router.delete("/:id", AdminActivityController.deleteActivity);

module.exports = router;
