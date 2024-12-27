const SearchFilter = require("../models/searchFilterSchema");
const userService =require("../services/userService")

class SearchFilterController {
  // Create a new search filter
  static async createSearchFilter(req, res) {
    try {
      const { user_id, location, radius, propertyType, budget, bedrooms, bathrooms, amenities, sortBy } = req.body;

      const searchFilter = new SearchFilter({
        user_id,
        location,
        radius,
        propertyType,
        budget,
        bedrooms,
        bathrooms,
        amenities,
        sortBy,
      });

      const savedFilter = await searchFilter.save();
      res.status(201).json({ message: "Search filter created successfully", data: savedFilter });
    } catch (error) {
      console.error("Error creating search filter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get all search filters for a user
  static async getUserSearchFilters(req, res) {
    try {
      const { userId } = req.params;

      const filters = await SearchFilter.find({ user_id: userId });
      res.status(200).json({ message: "Search filters retrieved successfully", data: filters });
    } catch (error) {
      console.error("Error retrieving search filters:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update a search filter by ID
  static async updateSearchFilter(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedFilter = await SearchFilter.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedFilter) {
        return res.status(404).json({ error: "Search filter not found" });
      }

      res.status(200).json({ message: "Search filter updated successfully", data: updatedFilter });
    } catch (error) {
      console.error("Error updating search filter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete a search filter by ID
  static async deleteSearchFilter(req, res) {
    try {
      const { id } = req.params;

      const deletedFilter = await SearchFilter.findByIdAndDelete(id);
      if (!deletedFilter) {
        return res.status(404).json({ error: "Search filter not found" });
      }

      res.status(200).json({ message: "Search filter deleted successfully" });
    } catch (error) {
      console.error("Error deleting search filter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = SearchFilterController;
