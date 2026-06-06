import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart } from '../features/cartSlice';
import { selectUser } from '../features/authSlice';
import api from '../lib/api';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    country: '',
  });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!items.length) { navigate('/cart'); return; }

    setLoading(true);
    setError('');

    try {
      const payload = {
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      };
      const { data } = await api.post('/api/orders', payload);
      dispatch(clearCart());
      navigate(`/order-success?order_id=${data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: '960px' }}>
        <h1 style={{ marginBottom: '32px' }}>Checkout</h1>

        <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>
          {/* Shipping */}
          <div>
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>Shipping Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-name">Full Name</label>
                    <input id="checkout-name" name="fullName" className="form-input" placeholder="John Doe" value={form.fullName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-email">Email</label>
                    <input id="checkout-email" name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-address">Address</label>
                  <input id="checkout-address" name="address" className="form-input" placeholder="123 Main Street" value={form.address} onChange={handleChange} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-city">City</label>
                    <input id="checkout-city" name="city" className="form-input" placeholder="New York" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-zip">ZIP</label>
                    <input id="checkout-zip" name="zip" className="form-input" placeholder="10001" value={form.zip} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-country">Country</label>
                    <input id="checkout-country" name="country" className="form-input" placeholder="United States" value={form.country} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="card" style={{ marginTop: '16px' }}>
              <h3 style={{ marginBottom: '16px' }}>
                In Your Bag
                <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '8px' }}>({items.length})</span>
              </h3>
              {items.map(item => (
                <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                    <img src={item.product.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop`} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.product.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 16px)' }}>
              <h3 style={{ marginBottom: '20px' }}>Summary</h3>

              <div className="order-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="order-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="order-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="order-summary-row total">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>

              {error && <div className="alert alert-error" style={{ marginTop: '16px' }}>{error}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
                id="checkout-place-order-btn"
                style={{ marginTop: '20px' }}
              >
                {loading ? <><span className="spinner spinner-sm"></span> Placing Order...</> : 'Place Order'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Your information is secure and encrypted.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
