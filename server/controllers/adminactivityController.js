const AdminActivity = require("../models/adminSchema");
const UserService = require("../services/UserService");

class adminActivityController {
  // Log an Admin Activity
  static async logActivity(req, res) {
    try {
      const { admin_id, action, target_id } = req.body;

      // Validate required fields
      if (!admin_id || !action) {
        return res.status(400).json({ message: "Admin ID and Action are required" });
      }

      // Check if the admin exists (using UserService)
      const admin = await UserService.findUserById(admin_id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Create a new admin activity log
      const activity = await AdminActivity.create({ admin_id, action, target_id });
      res.status(201).json({ message: "Activity logged successfully", data: activity });
    } catch (error) {
      console.error("Error logging activity:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Get All Admin Activities (with optional filters)
  static async getActivities(req, res) {
    try {
      const { admin_id, action, startDate, endDate, target_id } = req.query;

      // Build query filters
      const query = {};
      if (admin_id) query.admin_id = admin_id;
      if (action) query.action = action;
      if (target_id) query.target_id = target_id;
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      // Fetch admin activities
      const activities = await AdminActivity.find(query)
        .populate("admin_id", "firstName lastName email") // Assuming user fields
        .sort({ createdAt: -1 });

      res.status(200).json({ message: "Activities fetched successfully", data: activities });
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Get Activity by ID
  static async getActivityById(req, res) {
    try {
      const { id } = req.params;

      // Fetch specific admin activity
      const activity = await AdminActivity.findById(id).populate("admin_id", "firstName lastName email");
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      res.status(200).json({ message: "Activity fetched successfully", data: activity });
    } catch (error) {
      console.error("Error fetching activity by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Delete an Admin Activity
  static async deleteActivity(req, res) {
    try {
      const { id } = req.params;

      // Delete specific admin activity
      const activity = await AdminActivity.findByIdAndDelete(id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
      console.error("Error deleting activity:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = adminActivityController;
