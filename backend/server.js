const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const sendEmail = require("./utils/sendEmail");
const User = require("./models/User");
const Payment = require("./models/Payment");
const session = require("express-session");
const cookieParser = require("cookie-parser");

dotenv.config(); // ✅ Ensure .env is loaded before accessing secrets
const app = express();
connectDB();

// Middleware setup
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Stripe config
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Webhook route — must come BEFORE express.json()
app.post(
  "/api/payments/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          console.log("🔥 Received webhook event:", event.type);
          const paymentIntent = event.data.object;
          console.log("📦 PaymentIntent ID:", paymentIntent.id);
          const userEmail =
            paymentIntent.metadata?.email || paymentIntent.receipt_email;
          console.log("📧 Email from metadata:", userEmail);

          if (!userEmail) throw new Error("No email in payment metadata");

          const user = await User.findOne({ email: userEmail });
          if (!user) throw new Error("User not found for email: " + userEmail);

          user.isPremium = true;
          await user.save();

          await Payment.create({
            userId: user._id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
          });

          console.log("✅ Payment saved to DB for", user.email);

          const subject = "Payment Received 🎉";
          const html = `<h3>Hi ${user.email},</h3><p>Your payment of $${(paymentIntent.amount / 100).toFixed(2)} was successful.</p><p>Welcome to premium!</p>`;
          await sendEmail(user.email, subject, html);
          console.log(`✅ Email sent to ${user.email}`);
          break;

        case "payment_intent.payment_failed":
          console.log("❌ Payment failed:", event.data.object.id);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).send("Webhook received");
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).send("Internal server error in webhook");
    }
  }
);

// ❗ Add this AFTER webhook route
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

app.get("/api/auth/me", (req, res) => {
  if (req.session.user) {
    return res.json({ user: req.session.user });
  }
  res.status(401).json({ message: "Not authenticated" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
