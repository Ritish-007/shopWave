const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// GET /api/products — list all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, min_price, max_price, sort = 'created_at', order = 'desc' } = req.query;

    let query = supabase
      .from('products')
      .select('*')
      .gt('stock', 0);

    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);
    if (min_price) query = query.gte('price', parseFloat(min_price));
    if (max_price) query = query.lte('price', parseFloat(max_price));

    const validSortFields = ['created_at', 'price', 'name'];
    if (validSortFields.includes(sort)) {
      query = query.order(sort, { ascending: order === 'asc' });
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/categories — get distinct categories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .neq('category', null);

    if (error) throw error;

    const categories = [...new Set(data.map(p => p.category))];
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Product not found' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
