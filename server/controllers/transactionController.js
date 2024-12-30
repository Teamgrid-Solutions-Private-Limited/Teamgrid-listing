const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transaction = require("../models/transaction");

class paymentController {
  // Initialize Razorpay instance
  static razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Create Payment Order
  static async createOrder(req, res) {
    try {
      const { amount, user_id, service_type } = req.body;

      // Razorpay order options
      const options = {
        amount: amount * 100, // Convert to paise (e.g., 100 INR = 10000 paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1, // Auto-capture the payment after authorization
      };

      // Create order with Razorpay
      const order = await PaymentController.razorpay.orders.create(options);

      // Save transaction to database
      const transaction = new Transaction({
        user_id,
        service_type,
        amount,
        payment_method: "UPI", // Defaulting to UPI for now
        invoice_id: order.id,
        payment_status: "pending",
      });

      await transaction.save();

      // Send the order details to the frontend
      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error("Error creating order:", error.message);
      res.status(500).json({ success: false, message: "Server error while creating order" });
    }
  }

  // Verify Payment
  static async verifyPayment(req, res) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      // Generate HMAC to verify Razorpay signature
      const hmac = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      // Validate signature
      if (hmac !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid payment signature" });
      }

      // Update transaction status to "completed"
      const transaction = await Transaction.findOneAndUpdate(
        { invoice_id: razorpay_order_id },
        { payment_status: "completed" },
        { new: true }
      );

      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }

      res.status(200).json({ success: true, message: "Payment verified successfully", transaction });
    } catch (error) {
      console.error("Error verifying payment:", error.message);
      res.status(500).json({ success: false, message: "Server error while verifying payment" });
    }
  }

  // Fetch Transaction Details (Optional)
  static async getTransaction(req, res) {
    try {
      const { transactionId } = req.params;

      const transaction = await Transaction.findById(transactionId).populate("user_id");

      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }

      res.status(200).json({ success: true, transaction });
    } catch (error) {
      console.error("Error fetching transaction:", error.message);
      res.status(500).json({ success: false, message: "Server error while fetching transaction" });
    }
  }
}

module.exports = paymentController;
