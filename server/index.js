const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems, customerEmail } = req.body;
  try {
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.product.name,
          images: [item.product.imageUrl],
        },
        unit_amount: Math.round(item.product.price * 100), // Stripe expects paise
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/cart?success=true',
      cancel_url: 'http://localhost:3000/cart?canceled=true',
      customer_email: customerEmail,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Stripe server running on port ${PORT}`)); 