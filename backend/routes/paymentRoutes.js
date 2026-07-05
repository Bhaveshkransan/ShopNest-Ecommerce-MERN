const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const router = express.Router();

router.post("/order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;