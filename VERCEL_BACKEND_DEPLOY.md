# How to Deploy Backend to Vercel

## Prerequisites
- GitHub account (already have this ✓)
- Vercel account (free at https://vercel.com)
- Your repo pushed to GitHub (already done ✓)

## Step 1: Create Vercel Account & Connect GitHub

1. Go to https://vercel.com
2. Sign up with GitHub (easier than email)
3. Authorize Vercel to access your GitHub account
4. You'll be redirected to Vercel dashboard

## Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find `piggy-and-kay` repo in the list
4. Click **"Import"**

## Step 3: Configure Project Settings

When Vercel opens the import dialog:

1. **Project Name**: Keep it as `piggy-and-kay-backend` (or similar)
2. **Framework Preset**: Select **"Other"** (Vercel doesn't auto-detect Express)
3. **Root Directory**: Leave blank (code is at root)
4. **Build Command**: Leave blank (no build needed for backend)
5. **Output Directory**: Leave blank
6. Click to expand and add these:

   ```
   STRIPE_SECRET_KEY = sk_test_YOUR_SECRET_KEY_HERE
   STRIPE_PUBLISHABLE_KEY = pk_test_YOUR_PUBLISHABLE_KEY_HERE
   STRIPE_BOOK_PRODUCT_ID = prod_TY8naWWVTJQEML
   FRONTEND_URL = https://piggy-and-kay.vercel.app
   PORT = 3001
   ```
   
   (Use your actual Stripe keys from your `.env` file)

7. Click **"Deploy"**

## Step 4: Wait for Deployment

- Vercel will build and deploy your backend
- Takes ~2-5 minutes
- You'll see a progress indicator
- Once done, you'll get a URL like: `https://piggy-and-kay-backend.vercel.app`

## Step 5: Configure Frontend to Use Backend

1. Go to your **frontend Vercel project** (piggy-and-kay)
2. Click **Settings** → **Environment Variables**
3. Add this variable:
   ```
   VITE_BACKEND_API_URL = https://piggy-and-kay-backend.vercel.app/api
   ```
   (Use the URL you got from Step 4, with `/api` at the end)

4. Click **"Save"**
5. Go to **Deployments** tab
6. Click the latest deployment → **"Redeploy"** (to apply the new env var)

## Step 6: Test It Works

1. Visit `https://piggy-and-kay.vercel.app`
2. Try the preorder flow:
   - Enter email and waitlist signup
   - Click "Pre-order" 
   - Select quantity
   - Click "Pre-order Now"
   - Should redirect to Stripe (NOT localhost)
   - Use test card: `4242 4242 4242 4242` (any future expiry, any CVC)
   - Complete payment
   - Should see success page

## Troubleshooting

### "502 Bad Gateway" or Backend URL not working
- Check backend env vars were set correctly in Step 3
- Go to **Deployments** on backend project and check logs
- Look for `STRIPE_SECRET_KEY` error in logs

### Frontend can't reach backend
- Make sure `VITE_BACKEND_API_URL` is set exactly right (copy from browser URL bar)
- Verify it ends with `/api`
- Redeploy frontend after setting env var

### Test payment fails with CORS error
- Backend CORS is already configured to accept `piggy-and-kay.vercel.app`
- If you changed the domain, update `server.js` line 34 and redeploy

## Important Notes

- **Vercel Backend URL** will look like: `https://piggy-and-kay-backend.vercel.app`
- **Auto-deploys**: Backend will auto-deploy whenever you push to GitHub main branch
- **No build command needed**: Vercel will start Node with `npm start` or `node server.js`
- **Environment variables**: Always set in Vercel dashboard, never commit `.env` with real keys

## After Deployment

Your app will be fully functional at:
- **Frontend**: https://piggy-and-kay.vercel.app
- **Backend API**: https://piggy-and-kay-backend.vercel.app/api

All traffic goes through HTTPS, and Stripe will recognize it as legitimate.
