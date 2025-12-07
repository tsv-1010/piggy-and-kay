const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

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

    // Validate quantity
    if (![1, 3, 5].includes(quantity)) {
      return res.status(400).json({ error: 'Invalid quantity. Must be 1, 3, or 5.' });
    }

    // Pricing logic
    const basePrice = 2000; // $20 in cents
    let subtotal = quantity * basePrice;
    let discount = 0;

    if (quantity >= 5) {
      discount = Math.round(subtotal * 0.15); // 15% off
    } else if (quantity >= 3) {
      discount = Math.round(subtotal * 0.10); // 10% off
    }

    const bookPrice = subtotal - discount; // Price after discount in cents
    const donationCents = Math.round((donation || 0) * 100);

    // Build line items for Stripe Checkout
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Piggy & Kay: The Sparkle Within (${quantity} ${quantity === 1 ? 'copy' : 'copies'})`,
            description: `Pre-order ${quantity} book${quantity > 1 ? 's' : ''}${discount > 0 ? ` - ${quantity >= 5 ? '15%' : '10%'} discount applied` : ''}`,
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
      cancel_url: process.env.FRONTEND_URL,
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ error: error.message });
  }
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
