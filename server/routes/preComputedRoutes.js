// routes/precomputeRoutes.js
const express = require('express');
const { precomputeResults } = require('../controllers/precomputedController');
const router = express.Router();

router.post('/add', precomputeResults);

module.exports = router;