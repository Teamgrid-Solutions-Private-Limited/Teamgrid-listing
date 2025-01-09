const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// Create a new lead
router.post('/leads', leadController.createLead);

// Get all leads
router.get('/leads', leadController.getAllLeads);

// Get leads for a specific property
router.get('/leads/property/:propertyId', leadController.getLeadsForProperty);

// Update lead status
router.put('/leads/:id', leadController.updateLead);

// Delete lead
router.delete('/leads/:id', leadController.deleteLead);

module.exports = router;
