const express = require("express");
const router = express.Router();

const PaymentController = require("../controllers/transactionController");

// Create Order Route
app.post("/api/payment/create-order", PaymentController.createOrder);

// Verify Payment Route
app.post("/api/payment/verify-payment", PaymentController.verifyPayment);

// Get Transaction Route
app.get("/api/payment/transaction/:transactionId", PaymentController.getTransaction);

module.exports = router;