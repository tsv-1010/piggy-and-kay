# Deployment Checklist

## ✅ What's Done

- [x] Frontend code updated to use environment variables
- [x] `.env.local` created for local development
- [x] `.env.example` template updated
- [x] All changes committed to Git and pushed to GitHub
- [x] Comprehensive `DEPLOYMENT_GUIDE.md` created

## 📋 Next Steps (In Order)

### Phase 1: Deploy Backend
- [ ] Choose hosting (Vercel, Heroku, or Railway)
- [ ] Connect GitHub repo to chosen platform
- [ ] Set environment variables in platform:
  - `STRIPE_SECRET_KEY=sk_test_...`
  - `STRIPE_PUBLISHABLE_KEY=pk_test_...`
  - `STRIPE_BOOK_PRODUCT_ID=prod_TY8naWWVTJQEML`
  - `FRONTEND_URL=https://piggy-and-kay.vercel.app`
- [ ] Deploy and get backend URL (e.g., `https://piggy-and-kay-backend.vercel.app`)

### Phase 2: Update Frontend Environment
- [ ] Go to Vercel project settings for `piggy-and-kay`
- [ ] Add environment variable:
  - `VITE_BACKEND_API_URL=<your-backend-url>/api`
- [ ] Trigger redeploy (or wait for auto-deploy if pushed to main)

### Phase 3: Test Production
- [ ] Visit `https://piggy-and-kay.vercel.app`
- [ ] Test complete preorder flow end-to-end
- [ ] Verify social share buttons work
- [ ] Test with Stripe test card: `4242 4242 4242 4242`

### Phase 4: Future (Optional)
- [ ] Webhooks (when ready for automated order tracking)
- [ ] Email confirmations (when ready)
- [ ] Production Stripe keys (when going live for real)

## 🔑 Important Notes

**Local Development:**
- Frontend will automatically use `.env.local` (http://localhost:3001/api)
- No code changes needed when switching between local and production
- Just ensure correct env var is set

**Production:**
- All sensitive keys stored in Vercel/hosting platform, NOT in code
- `.env` file is git-ignored (never committed)
- Environment variables set via platform dashboard

**Security:**
- Never commit `.env` file with real keys
- Use `.env.example` as template for team members
- Rotate Stripe keys if accidentally exposed
