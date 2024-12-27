const express = require("express");

const {
  addFavorite,
  getAllFavorites,
  getFavoritesByBuyer,
  removeFavorite,
} = require("../controllers/favouriteController");

const router = express.Router();

router.post("/add", addFavorite);
router.put("/get/:id", getFavoritesByBuyer);
router.get("/get", getAllFavorites);
router.delete("/delete", removeFavorite);

module.exports = router;
