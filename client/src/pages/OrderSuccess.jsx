import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { clearCart } from '../features/cartSlice';

export default function OrderSuccess() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => { dispatch(clearCart()); }, [dispatch]);

  return (
    <div className="success-page">
      <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f5e8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#128a09" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Order Placed</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
          Thank you for your purchase. You'll receive a confirmation email shortly.
        </p>
        {orderId && (
          <div style={{ marginBottom: '24px', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Order ID</p>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.03em', marginTop: '2px' }}>
              #{orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/orders"><button className="btn btn-primary" id="success-view-orders-btn">View Orders</button></Link>
          <Link to="/products"><button className="btn btn-secondary" id="success-continue-btn">Continue Shopping</button></Link>
        </div>
      </div>
    </div>
  );
}
