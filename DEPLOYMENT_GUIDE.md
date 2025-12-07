# Deployment Guide - Piggy & Kay

## Overview
The app is split into:
- **Frontend**: React + Vite + Tailwind (deploys to Vercel)
- **Backend**: Express.js + Stripe API (needs separate deployment)

Both need to be deployed for the app to work on production.

---

## Step 1: Deploy Backend

Choose one option:

### Option A: Vercel (Recommended - Free tier available)
1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repo
3. In **Settings → Environment Variables**, add:
   ```
   STRIPE_SECRET_KEY = sk_test_...
   STRIPE_PUBLISHABLE_KEY = pk_test_...
   STRIPE_BOOK_PRODUCT_ID = prod_TY8naWWVTJQEML
   PORT = 3001
   FRONTEND_URL = https://piggy-and-kay.vercel.app
   ```
4. Deploy - you'll get a URL like `https://piggy-and-kay-backend.vercel.app`

### Option B: Heroku
1. Create a free account on [Heroku](https://www.heroku.com)
2. Create a new app: `heroku create piggy-and-kay-backend`
3. Set environment variables:
   ```
   heroku config:set STRIPE_SECRET_KEY=sk_test_...
   heroku config:set STRIPE_PUBLISHABLE_KEY=pk_test_...
   heroku config:set STRIPE_BOOK_PRODUCT_ID=prod_TY8naWWVTJQEML
   heroku config:set FRONTEND_URL=https://piggy-and-kay.vercel.app
   ```
4. Deploy: `git push heroku main` (after configuring Heroku git remote)

### Option C: Railway.app
1. Create account on [Railway](https://railway.app)
2. Connect your GitHub repo
3. Set environment variables in dashboard
4. Deploy - get your production URL

**After deploying backend**, you'll get a URL like:
- Vercel: `https://piggy-and-kay-backend.vercel.app`
- Heroku: `https://piggy-and-kay-backend.herokuapp.com`
- Railway: `https://piggy-and-kay-backend-production.up.railway.app`

---

## Step 2: Update Frontend with Backend URL

Once you have the backend URL:

1. In your Vercel project for the frontend, go to **Settings → Environment Variables**
2. Add:
   ```
   VITE_BACKEND_API_URL = https://your-backend-url/api
   ```
   
   Example (if using Vercel for backend):
   ```
   VITE_BACKEND_API_URL = https://piggy-and-kay-backend.vercel.app/api
   ```

3. Redeploy the frontend (Vercel will auto-deploy when you push to main, or manually trigger)

---

## Step 3: Test Production URLs

1. Visit `https://piggy-and-kay.vercel.app`
2. Test the preorder flow:
   - Enter quantity
   - Click "Pre-order Now"
   - Should redirect to Stripe checkout (not localhost)
   - Use test card: `4242 4242 4242 4242` (any future expiry, any CVC)
   - Complete purchase
   - Should see success page with social share buttons

---

## Step 4: Update CORS (If Needed)

If you get CORS errors, update `server.js` line 34:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',  // local dev
    'https://piggy-and-kay.vercel.app'  // production
  ],
  credentials: true
}));
```

Then commit and redeploy backend.

---

## Step 5: Future - Webhooks (Optional)

Currently, webhooks are skeletal. When ready to add:
1. Get Webhook Secret from Stripe Dashboard
2. Set as env var: `STRIPE_WEBHOOK_SECRET=whsec_...`
3. Activate webhook handler in `server.js`
4. Configure webhook endpoint in Stripe Dashboard to point to your backend

---

## Local Development

To keep working locally while backend is in production:

```bash
# Terminal 1: Backend (local)
npm run server

# Terminal 2: Frontend (local, uses VITE_BACKEND_API_URL from .env.local)
npm run dev
```

Frontend will use `.env.local` which points to `http://localhost:3001/api`.

To test with production backend from local frontend, temporarily change `.env.local`:
```
VITE_BACKEND_API_URL=https://your-production-backend-url/api
```

Then restart frontend with `npm run dev`.

---

## Troubleshooting

### 500 Error on `/api/create-checkout-session`
- Check backend environment variables are set correctly
- Check Stripe Secret Key is valid in Stripe Dashboard

### CORS Errors (origin not allowed)
- Make sure frontend URL is in backend's CORS origin list
- Redeploy backend after updating `server.js`

### Stripe Checkout redirects to `/?canceled=true` immediately
- Frontend is unable to reach backend API
- Check `VITE_BACKEND_API_URL` is correct and backend is running
- Check browser DevTools Network tab for 404 or CORS errors

### Test Payment Not Working
- Verify you're using test mode card: `4242 4242 4242 4242`
- Any future expiry date and any CVC work in test mode
- Check Stripe Dashboard → Payments to see if charge was created

---

## Production Stripe Keys

**Important**: The current `.env` file contains **TEST** Stripe keys (prefix `sk_test_` and `pk_test_`).

For production, you need **LIVE** keys:
1. In Stripe Dashboard, toggle from "Test Mode" to "Live Mode" (top left)
2. Copy Live Secret Key (`sk_live_...`) and Publishable Key (`pk_live_...`)
3. Update environment variables in your hosting platform
4. Update product ID if needed (live product IDs are different)

**Never commit live keys to Git.** Always use environment variables via your hosting platform.
