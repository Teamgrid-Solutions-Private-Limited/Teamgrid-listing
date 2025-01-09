const express = require('express');
const router = express.Router();
const {addProperty, searchProperties, deleteProperty, PropertyCompare } = require('../controllers/propertyController');

router.post('/add', addProperty);
router.get('/get',searchProperties);
router.get('/compare',PropertyCompare);

router.delete('/delete/:id',deleteProperty);

module.exports = router;