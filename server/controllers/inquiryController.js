const Inquiry = require("../models/Inquiry");
const UserService = require("../services/userService"); // Import UserService

class inquiryController {
  // Create a new inquiry
  static async createInquiry(req, res) {
    try {
      const { buyer_id, seller_id } = req.body;

      // Validate buyer and seller using UserService
      const buyer = await UserService.findUserById(buyer_id); // Use UserService to find buyer
      const seller = await UserService.findUserById(seller_id); // Use UserService to find seller

      if (!buyer || !seller) {
        return res.status(400).json({ success: false, message: "Invalid buyer or seller ID" });
      }

      const inquiry = await Inquiry.create(req.body);
      res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get all inquiries
  static async getAllInquiries(req, res) {
    try {
      const inquiries = await Inquiry.find().populate("buyer_id seller_id", "firstName lastName email");
      res.status(200).json({ success: true, data: inquiries });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get an inquiry by ID
  static async getInquiryById(req, res) {
    try {
      const inquiry = await Inquiry.findById(req.params.id).populate("buyer_id seller_id", "firstName lastName email");
      if (!inquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      res.status(200).json({ success: true, data: inquiry });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update an inquiry by ID
  static async updateInquiry(req, res) {
    try {
      const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!inquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      res.status(200).json({ success: true, data: inquiry });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Delete an inquiry by ID
  static async deleteInquiry(req, res) {
    try {
      const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = inquiryController;
