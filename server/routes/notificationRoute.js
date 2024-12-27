const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notificationController");

// Create a new notification
router.post("/", NotificationController.createNotification);

// Get all notifications for a user
router.get("/:user_id", NotificationController.getUserNotifications);

// Mark a specific notification as read
router.patch("/:notification_id/read", NotificationController.markAsRead);

// Mark all notifications as read for a user
router.patch("/:user_id/read-all", NotificationController.markAllAsRead);

// Delete a specific notification
router.delete("/:notification_id", NotificationController.deleteNotification);

// Delete all notifications for a user
router.delete("/:user_id/all", NotificationController.deleteAllNotifications);

module.exports = router;
