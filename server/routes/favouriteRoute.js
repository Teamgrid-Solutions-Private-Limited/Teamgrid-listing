
const express = require('express');

const {  addFavorite, getAllFavorites, getFavoritesByBuyer,} = require('../controllers/favouriteController');

const router = express.Router();

router.post('/add', addFavorite);
router.put('/get/:id',getFavoritesByBuyer );
router.get('/get', getAllFavorites);

module.exports = router;