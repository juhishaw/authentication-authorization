const express = require("express");
const Stripe = require("stripe");
const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const User = require("../models/User");

router.use(express.json());

// Create payment intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { email },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe PaymentIntent Error:", error);
    res.status(500).json({ message: "Payment failed" });
  }
});

// Payment history
router.get("/history/:userId", async (req, res) => {
  const payments = await Payment.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });
  res.json(payments);
});

module.exports = router;
