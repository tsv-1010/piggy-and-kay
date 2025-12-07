const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const DEFAULT_FRONTEND = 'http://localhost:5173';

const setCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || DEFAULT_FRONTEND);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Stripe-Signature');
};

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { quantity, donation } = req.body || {};
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'Invalid quantity. Must be an integer >= 1.' });
    }

    const basePrice = 2000; // $20 in cents
    const subtotal = qty * basePrice;
    let discount = 0;

    if (qty >= 5) {
      discount = Math.round(subtotal * 0.15);
    } else if (qty >= 3) {
      discount = Math.round(subtotal * 0.10);
    }

    const bookPrice = subtotal - discount;
    const donationCents = Math.round((Number(donation) || 0) * 100);

    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Piggy & Kay: The Sparkle Within (${qty} ${qty === 1 ? 'copy' : 'copies'})`,
            description: `Pre-order ${qty} book${qty > 1 ? 's' : ''}${discount > 0 ? ` - ${qty >= 5 ? '15%' : '10%'} discount applied` : ''}`,
            images: ['https://via.placeholder.com/400x300?text=Piggy+and+Kay'],
          },
          unit_amount: bookPrice,
        },
        quantity: 1,
      },
    ];

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

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || DEFAULT_FRONTEND}/?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || DEFAULT_FRONTEND}/?canceled=true`,
    });

    return res.json({ sessionUrl: session.url, id: session.id });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
