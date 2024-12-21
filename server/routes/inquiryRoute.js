const express = require('express');
const InquiryController = require('../controllers/inquiryController'); // Import InquiryController
const router = express.Router();

// Route to create a new inquiry
router.post('/inquiries', InquiryController.createInquiry);

// Route to get all inquiries
router.get('/inquiries', InquiryController.getAllInquiries);

// Route to get an inquiry by ID
router.get('/inquiries/:id', InquiryController.getInquiryById);

// Route to update an inquiry by ID
router.put('/inquiries/:id', InquiryController.updateInquiry);

// Route to delete an inquiry by ID
router.delete('/inquiries/:id', InquiryController.deleteInquiry);

module.exports = router;
