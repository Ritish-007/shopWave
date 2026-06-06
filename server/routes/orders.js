const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

// POST /api/orders — place an order directly (no payment gateway)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items } = req.body; // [{ product_id, quantity }]

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Fetch real product data from Supabase (validate stock & prices server-side)
    const productIds = items.map(i => i.product_id);
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, name, price, stock')
      .in('id', productIds);

    if (productError) throw productError;

    // Validate stock for each item
    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);
      if (!product) return res.status(400).json({ error: `Product not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for "${product.name}"` });
      }
    }

    // Calculate total from server-side prices
    const total = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + product.price * item.quantity;
    }, 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        status: 'pending',
        total: parseFloat(total.toFixed(2)),
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items — snapshot unit_price at purchase time
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price, // snapshot at purchase time
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Decrement stock for each item
    for (const item of items) {
      await supabase.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });
    }

    res.status(201).json({ order });
  } catch (err) {
    console.error('POST /orders error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders — get current user's orders
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          product:products (id, name, image_url)
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('GET /orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id — single order (must belong to user)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          product:products (id, name, image_url, category)
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Order not found' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
