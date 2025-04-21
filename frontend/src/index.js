import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RGE4tCo41IPubaOVVKhj5XZgKidljx00qCFqQbwr4YX8r6WWFG4JubmwkjgUv16T7BYgMbwt463rCknaJLXAnu600JmC3g8vs"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);