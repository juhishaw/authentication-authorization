# 🔐 Backend – Authentication & Stripe Integration (Node.js + Express + MongoDB)

## 🛠 Technologies Used
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Nodemailer (for email verification & payment receipts)
- Stripe (for payment processing & subscriptions)
- dotenv (for managing environment variables)

## 📦 Features
- ✅ User Signup with email/password + confirmation
- ✅ Email verification with Mailtrap
- ✅ JWT-based login
- ✅ Protected routes (middleware)
- ✅ Stripe Elements one-time payments
- ✅ Stripe Webhooks to confirm payments
- ✅ Email receipt after successful payment
- ✅ Payment history saved in MongoDB
- ✅ Ready for Stripe Subscriptions (monthly/annual)

## 📡 Stripe Webhooks – How It Works
1. When a user completes a payment (via Stripe Elements), Stripe creates a `payment_intent`.
2. Stripe triggers a webhook to `/api/payments/webhook`.
3. We verify the signature using `STRIPE_WEBHOOK_SECRET`.
4. If it's a `payment_intent.succeeded`, we:
   - Mark the user as `isPremium = true`
   - Save payment record to DB
   - Send confirmation email

> ⚠️ Webhook must come BEFORE `express.json()` middleware to preserve raw body

## 🔧 .env Example
```
PORT=5050
MONGO_URI=mongodb://localhost:27017/authapp
JWT_SECRET=supersecurekey
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_pass
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🚀 Setup Instructions
1. `cd backend`
2. `npm install`
3. Configure `.env`
4. Run MongoDB locally or connect to Atlas
5. Start server: `npm run dev`
6. In separate terminal: `stripe listen --forward-to localhost:5050/api/payments/webhook`