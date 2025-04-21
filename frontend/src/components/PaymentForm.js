import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({ userEmail, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!navigator.onLine) {
      setMsg("⚠️ You are offline. Payments require internet.");
      return;
    }

    if (!stripe || !elements) {
      setMsg("Stripe is not ready.");
      return;
    }

    setLoading(true);
    setMsg("Processing...");

    try {
      const { data } = await api.post("/payments/create-payment-intent", {
        amount: 2000,
        email: userEmail,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMsg(`❌ Payment failed: ${result.error.message}`);
        setLoading(false);
      } else if (result.paymentIntent.status === "succeeded") {
        setMsg("✅ Payment successful!");

        // Wait for webhook to store payment
        setTimeout(() => {
          onPaymentSuccess(); // triggers refresh in parent (Dashboard)
          navigate("/dashboard");
        }, 3000);
      }
    } catch (err) {
      console.error("Stripe payment error:", err);
      setMsg("❌ Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <CardElement className="form-control p-3" />
      <button
        className="btn btn-success mt-3"
        type="submit"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : "Pay $20"}
      </button>
      {msg && <div className="mt-3 alert alert-info">{msg}</div>}
    </form>
  );
};

export default PaymentForm;
