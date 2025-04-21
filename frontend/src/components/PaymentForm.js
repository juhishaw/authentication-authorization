import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({ userEmail, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Processing...");

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
      setMsg(`❌ ${result.error.message}`);
    } else if (result.paymentIntent.status === "succeeded") {
      setMsg("✅ Payment successful!");

      // 🕒 Wait a bit to let webhook process the DB save
      setTimeout(() => {
        onPaymentSuccess(); // trigger reload in Dashboard
        navigate("/dashboard");
      }, 3000); // <-- 3 seconds gives the webhook time to save
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <CardElement className="form-control p-3" />
      <button className="btn btn-success mt-3" type="submit" disabled={!stripe}>
        Pay $20
      </button>
      <div className="mt-3">{msg}</div>
    </form>
  );
};

export default PaymentForm;
