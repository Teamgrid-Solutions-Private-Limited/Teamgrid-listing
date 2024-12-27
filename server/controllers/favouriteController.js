const Favorite = require("../models/favouriteSchema");
const Property = require("../models/propertySchema");
const userService = require("../services/userService");

class favoriteController {
  // Add a favorite
  static async addFavorite(req, res) {
    try {
      const { buyer_id, property_id } = req.body;

      // Validate buyer ID and property ID
      const user = await userService.findUserById(buyer_id);
      if (!user) {
        return res.status(404).json({ error: "Buyer not found" });
      }

      const property = await Property.findById(property_id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      // Check if already favorited
      const existingFavorite = await Favorite.findOne({ buyer_id, property_id });
      if (existingFavorite) {
        return res.status(400).json({ error: "Property is already in favorites" });
      }

      // Create a new favorite
      const favorite = await Favorite.create({ buyer_id, property_id });
      res.status(201).json({ message: "Favorite added successfully", favorite });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Remove a favorite
  static async removeFavorite(req, res) {
    try {
      const { favorite_id } = req.params;

      // Find and delete favorite
      const favorite = await Favorite.findByIdAndDelete(favorite_id);
      if (!favorite) {
        return res.status(404).json({ error: "Favorite not found" });
      }

      res.status(200).json({ message: "Favorite removed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get all favorites for a buyer
  static async getFavoritesByBuyer(req, res) {
    try {
      const { buyer_id } = req.params;

      // Check if the user exists
      const user = await userService.findUserById(buyer_id);
      if (!user) {
        return res.status(404).json({ error: "Buyer not found" });
      }

      // Find all favorites for the buyer
      const favorites = await Favorite.find({ buyer_id }).populate("property_id");

      res.status(200).json({ favorites });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get all favorites with pagination and filtering
  static async getAllFavorites(req, res) {
    try {
      const { page = 1, limit = 10, buyer_id, property_id } = req.query;

      // Build filters
      const filters = {};
      if (buyer_id) filters.buyer_id = buyer_id;
      if (property_id) filters.property_id = property_id;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Fetch favorites with filters and pagination
      const favorites = await Favorite.find(filters)
        .populate("buyer_id")
        .populate("property_id")
        .limit(parseInt(limit))
        .skip(skip);

      // Count total matching documents for pagination
      const total = await Favorite.countDocuments(filters);

      res.status(200).json({ favorites, total, page, limit });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = favoriteController;
