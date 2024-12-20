const express = require('express');
const router = express.Router();
const {addProperty, searchProperties, deleteProperty } = require('../controllers/propertyController');

router.post('/add', addProperty);
router.get('/get',searchProperties);
router.delete('/delete/:id',deleteProperty);

module.exports = router;