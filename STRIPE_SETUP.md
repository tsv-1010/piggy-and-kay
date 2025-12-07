# Stripe API Integration Setup Guide

## Step 1: Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret Key** (starts with `sk_test_`)
3. Copy your **Publishable Key** (starts with `pk_test_`)

## Step 2: Create Your .env File

In the root of `piggy-and-kay/`, create a `.env` file with:

```
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_BOOK_PRODUCT_ID=prod_your_book_product_id
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Replace the placeholders with your actual Stripe keys.

**⚠️ IMPORTANT:** 
- Never commit `.env` to git (it's already in `.gitignore`)
- Never share your `STRIPE_SECRET_KEY` with anyone

## Step 3: Install Dependencies

```bash
npm install
```

This installs:
- `express` - backend server framework
- `stripe` - Stripe API client
- `dotenv` - environment variables
- `cors` - cross-origin requests

## Step 4: Run Backend & Frontend Together

Open a terminal in the `piggy-and-kay/` folder and run:

```bash
npm run dev:all
```

This starts:
- **Backend Server**: http://localhost:3001
- **Frontend (Vite)**: http://localhost:5173

Or run them separately in different terminals:

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run dev
```

## Step 5: Test the Checkout

1. Go to http://localhost:5173
2. Join the waitlist (fill in your info)
3. On the pre-order page, select quantity (1, 3, or 5) and optional tip
4. Click "Pre-order Now"
5. You should be redirected to Stripe Checkout with the correct total

## How It Works

### Flow:
1. **Frontend**: User clicks "Pre-order Now"
2. **Frontend**: Calls backend `POST /api/create-checkout-session` with quantity + donation
3. **Backend**: Calculates discount based on quantity, builds line items
4. **Backend**: Creates Stripe Checkout Session with Stripe API
5. **Backend**: Returns Stripe session URL to frontend
6. **Frontend**: Redirects user to Stripe Checkout
7. **User**: Completes payment on Stripe

### Pricing Logic (in server.js):
- 1 copy: $20
- 3 copies: $60 - 10% = $54
- 5 copies: $100 - 15% = $85
- Plus optional donation

## Troubleshooting

### "Connection refused" error?
- Make sure backend server is running on port 3001
- Check: `npm run server` is active in a terminal

### "Invalid API Key" error?
- Double-check your STRIPE_SECRET_KEY in `.env`
- Make sure you copied it correctly from Stripe dashboard

### Checkout button doesn't work?
- Open browser DevTools (F12)
- Go to Console tab
- Click the button and check for error messages
- Verify backend server is running

## Next Steps

- Create a Stripe Product ID for the book (backend already references `STRIPE_BOOK_PRODUCT_ID`)
- Test with Stripe's test card: `4242 4242 4242 4242` (expiry: any future date, CVC: any 3 digits)
- Deploy to production when ready

---

Questions? Check the Stripe docs: https://stripe.com/docs/checkout
