# 💻 Frontend – React + Stripe Elements + Auth

## 🛠 Technologies Used
- React
- React Router DOM
- Axios
- Bootstrap (basic UI)
- Stripe.js + React Stripe.js

## 📦 Features
- ✅ Signup & login forms
- ✅ Email verification screen
- ✅ Dashboard (protected route)
- ✅ Stripe Elements integration
- ✅ Payment success messages
- ✅ Live sync with backend via webhook
- ✅ Dynamic payment history table
- ✅ Token-based route protection

## 🔁 Frontend Flow
1. User signs up → receives Mailtrap email to verify
2. Logs in → JWT saved to `localStorage`
3. Navigates to `/dashboard`:
   - Sees payment form and history
4. On Stripe Elements payment:
   - Calls backend to create `PaymentIntent`
   - Confirms card via Stripe
   - Waits 3s → reloads history table via callback
5. Backend handles webhook → saves data & sends email

## 🧪 Test Card
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any
```

## 🚀 Setup Instructions
1. `cd frontend`
2. `npm install`
3. `npm start`
4. Make sure backend is running on port 5050

> Frontend expects the backend API base to be at `/api`