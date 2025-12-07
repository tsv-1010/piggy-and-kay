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

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'Missing sessionId query parameter' });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    return res.json(session);
  } catch (err) {
    console.error('checkout-session error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
