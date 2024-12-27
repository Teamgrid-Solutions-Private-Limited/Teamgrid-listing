const Inquiry = require("../models/inquriySchema");
const UserService = require("../services/userService"); // Import UserService
const AppError = require("../utils/appError"); // Assuming AppError is your custom error class

class inquiryController {
  // Create a new inquiry
  static async createInquiry(req, res, next) {
    try {
      const { property_id,buyer_id, seller_id, message } = req.body;

      // Validate that buyer_id, seller_id, property_id, and message are provided
      if (!property_id ||!buyer_id || !seller_id ||  !message) {
        throw new AppError("Buyer, seller, property IDs and message are required", 400);
      }

      // Validate buyer and seller using UserService
      const buyer = await UserService.findUserById(buyer_id); // Use UserService to find buyer
      const seller = await UserService.findUserById(seller_id); // Use UserService to find seller

      if (!buyer || !seller) {
        throw new AppError("Invalid buyer or seller ID", 400);
      }

      // Create the inquiry
      const inquiry = await Inquiry.create(req.body);
      res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
      next(error); // Pass error to centralized error handler
    }
  }

  // Get all inquiries
  static async getAllInquiries(req, res, next) {
    try {
      const inquiries = await Inquiry.find()
        .populate("buyer_id seller_id", "firstName lastName email")
        .populate("property_id", "name location price"); // Assuming the Property model has these fields
      res.status(200).json({ success: true, data: inquiries });
    } catch (error) {
      next(error); // Pass error to centralized error handler
    }
  }

  // Get an inquiry by ID
  static async getInquiryById(req, res, next) {
    try {
      const inquiry = await Inquiry.findById(req.params.id)
        .populate("buyer_id seller_id", "firstName lastName email")
        .populate("property_id", "name location price"); // Assuming the Property model has these fields

      if (!inquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      res.status(200).json({ success: true, data: inquiry });
    } catch (error) {
      next(error); // Pass error to centralized error handler
    }
  }

  // Update an inquiry by ID
  static async updateInquiry(req, res, next) {
    try {
      const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!inquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      res.status(200).json({ success: true, data: inquiry });
    } catch (error) {
      next(error); // Pass error to centralized error handler
    }
  }

  // Delete an inquiry by ID
  static async deleteInquiry(req, res, next) {
    try {
      const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
      
      if (!inquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      
      res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
    } catch (error) {
      next(error); // Pass error to centralized error handler
    }
  }
}

module.exports = inquiryController;
