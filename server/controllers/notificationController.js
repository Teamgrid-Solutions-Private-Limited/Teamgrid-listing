const Notification = require("../models/notificationSchema");
const UserService = require("../services/userService");

class notificationController {
  /**
   * Create a new notification
   */
  static async createNotification(req, res) {
    try {
      const { user_id, message, type } = req.body;

      // Validate user existence
      const user = await UserService.findUserById(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const notification = await Notification.create({ user_id, message, type });
      res.status(201).json({
        message: "Notification created successfully",
        data: notification,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get all notifications for a specific user
   */
  static async getUserNotifications(req, res) {
    try {
      const { user_id } = req.params;

      // Validate user existence
      const user = await UserService.findUserById(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const notifications = await Notification.find({ user_id }).sort({ createdAt: -1 });
      res.status(200).json({ data: notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Mark a specific notification as read
   */
  static async markAsRead(req, res) {
    try {
      const { notification_id } = req.params;

      const notification = await Notification.findById(notification_id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      notification.status = "read";
      await notification.save();

      res.status(200).json({ message: "Notification marked as read", data: notification });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Mark all notifications as read for a specific user
   */
  static async markAllAsRead(req, res) {
    try {
      const { user_id } = req.params;

      // Validate user existence
      const user = await UserService.findUserById(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await Notification.updateMany({ user_id, status: "unread" }, { status: "read" });
      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete a specific notification
   */
  static async deleteNotification(req, res) {
    try {
      const { notification_id } = req.params;

      const notification = await Notification.findById(notification_id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      await notification.remove();
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete all notifications for a specific user
   */
  static async deleteAllNotifications(req, res) {
    try {
      const { user_id } = req.params;

      // Validate user existence
      const user = await UserService.findUserById(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await Notification.deleteMany({ user_id });
      res.status(200).json({ message: "All notifications deleted successfully" });
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = notificationController;
