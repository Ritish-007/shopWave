import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCartItems, selectCartTotal, selectCartCount } from '../features/cartSlice';
import CartItem from '../components/CartItem';

export default function Cart() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  if (items.length === 0) {
    return (
      <main className="page">
        <div className="container">
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </div>
            <h3>Your bag is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" style={{ marginTop: '20px', display: 'inline-block' }}>
              <button className="btn btn-primary btn-lg" id="cart-browse-btn">Shop Now</button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  return (
    <main className="page">
      <div className="container">
        <h1 style={{ marginBottom: '4px' }}>Your Bag</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>
          {count} item{count !== 1 ? 's' : ''}
        </p>

        <div className="cart-layout">
          {/* Items */}
          <div>
            {items.map(item => <CartItem key={item.product.id} item={item} />)}
          </div>

          {/* Summary */}
          <div className="order-summary">
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>Summary</h3>

              <div className="order-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="order-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="order-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="order-summary-row total">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>

              {total < 100 && (
                <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  You're ${(100 - total).toFixed(2)} away from free shipping.
                </div>
              )}

              <Link to="/checkout" style={{ display: 'block', marginTop: '20px' }}>
                <button className="btn btn-primary btn-full btn-lg" id="cart-checkout-btn">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
