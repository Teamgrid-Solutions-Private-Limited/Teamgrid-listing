const express = require("express");
const router = express.Router();
const SearchFilterController = require("../controllers/searchFilterController");

// Create a new search filter
router.post("/", SearchFilterController.createSearchFilter);

// Get all search filters for a user
router.get("/:userId", SearchFilterController.getUserSearchFilters);

// Update a search filter by ID
router.put("/:id", SearchFilterController.updateSearchFilter);

// Delete a search filter by ID
router.delete("/:id", SearchFilterController.deleteSearchFilter);

module.exports = router;
