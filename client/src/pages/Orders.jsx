import { useEffect, useState } from 'react';
import api from '../lib/api';

function statusBadge(status) {
  const map = { paid: 'badge-success', pending: 'badge-warning', shipped: 'badge-dark', delivered: 'badge-success', cancelled: 'badge-danger' };
  return `badge ${map[status] || 'badge-muted'}`;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/orders')
      .then(r => setOrders(r.data))
      .catch(e => setError(e.response?.data?.error || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center page"><div className="spinner"></div></div>;

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ marginBottom: '4px' }}>My Orders</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Your order history will appear here after your first purchase.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card order-card">
              <div className="order-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className={statusBadge(order.status)}>{order.status}</span>
                  </div>
                  <div className="order-meta">
                    {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>${Number(order.total).toFixed(2)}</div>
                </div>
              </div>

              {order.order_items?.length > 0 && (
                <>
                  <hr className="divider" />
                  <div className="order-items-list">
                    {order.order_items.map(item => (
                      <div key={item.id} className="order-item-row">
                        <div className="order-item-img">
                          <img
                            src={item.product?.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop`}
                            alt={item.product?.name}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.product?.name || 'Product'}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}</div>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>${(item.quantity * item.unit_price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
