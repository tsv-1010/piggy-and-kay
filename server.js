const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');

let stripeSecret = process.env.STRIPE_SECRET_KEY;
// Fallback: if dotenv didn't load (sometimes happens on Windows), try reading .env manually
if (!stripeSecret) {
  try {
    const envRaw = fs.readFileSync('.env', 'utf8');
    const match = envRaw.match(/^STRIPE_SECRET_KEY=(.+)$/m);
    if (match && match[1]) {
      stripeSecret = match[1].trim();
      // also populate process.env for consistency
      process.env.STRIPE_SECRET_KEY = stripeSecret;
    }
  } catch (e) {
    // ignore read errors, we'll handle missing key below
  }
}

if (!stripeSecret) {
  console.error('FATAL: STRIPE_SECRET_KEY is not set in environment. Please add it to your .env file.');
  process.exit(1);
}

const stripe = require('stripe')(stripeSecret);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

/**
 * POST /api/create-checkout-session
 * Creates a Stripe Checkout Session with books + optional tip
 * 
 * Body:
 * {
 *   quantity: 1|3|5,
 *   donation: number (optional, in dollars)
 * }
 */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { quantity, donation } = req.body;

    // Validate quantity: accept any positive integer >= 1
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'Invalid quantity. Must be an integer >= 1.' });
    }

    // Pricing logic
    const basePrice = 2000; // $20 in cents
    const subtotal = qty * basePrice;
    let discount = 0;

    if (qty >= 5) {
      discount = Math.round(subtotal * 0.15); // 15% off
    } else if (qty >= 3) {
      discount = Math.round(subtotal * 0.10); // 10% off
    }

    const bookPrice = subtotal - discount; // Price after discount in cents
    const donationCents = Math.round((Number(donation) || 0) * 100);

    // Build line items for Stripe Checkout
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Piggy & Kay: The Sparkle Within (${qty} ${qty === 1 ? 'copy' : 'copies'})`,
            description: `Pre-order ${qty} book${qty > 1 ? 's' : ''}${discount > 0 ? ` - ${qty >= 5 ? '15%' : '10%'} discount applied` : ''}`,
            images: ['https://via.placeholder.com/400x300?text=Piggy+and+Kay'], // Replace with your book image URL
          },
          unit_amount: bookPrice,
        },
        quantity: 1,
      },
    ];

    // Add donation as separate line item if provided
    if (donationCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Support Our Mission (Tip)',
            description: 'Help us create free resources for teachers',
          },
          unit_amount: donationCents,
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/?canceled=true`,
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/checkout-session
 * Retrieve a Checkout Session by ID (for success page verification)
 * Query: sessionId
 */
app.get('/api/checkout-session', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId query parameter' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    res.json(session);
  } catch (error) {
    console.error('Checkout session retrieval error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/webhook
 * Stripe webhook endpoint for payment events
 * 
 * TODO: 
 * 1. Get STRIPE_WEBHOOK_SECRET from Stripe Dashboard
 * 2. Add to .env and Vercel env vars
 * 3. Implement event handlers (checkout.session.completed, payment_intent.succeeded, etc.)
 */
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET not set. Webhook verification disabled.');
    // In development, you might skip verification; in production, fail safely
    if (process.env.NODE_ENV === 'production') {
      return res.status(400).json({ error: 'Webhook secret not configured' });
    }
  }

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body);
    }
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  // Log all events
  console.log(`Received event: ${event.type}`);

  // Handle specific events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(`✓ Checkout completed: ${session.id}`);
      // TODO: Update order status in your database, send confirmation email, etc.
      break;
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log(`✓ Payment succeeded: ${paymentIntent.id}`);
      // TODO: Mark order as paid
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log(`✗ Payment failed: ${paymentIntent.id}`);
      // TODO: Notify customer, log failure
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  res.json({ received: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n✨ Piggy & Kay Backend Server Running ✨`);
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`\nReady to process pre-orders! 📚\n`);
});
