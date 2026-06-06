import { useEffect, useState } from 'react';
import api from '../lib/api';

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

function statusBadge(status) {
  const map = { paid: 'badge-success', pending: 'badge-warning', shipped: 'badge-purple', delivered: 'badge-success', cancelled: 'badge-danger' };
  return `badge ${map[status] || 'badge-muted'}`;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api.get('/api/admin/orders')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.patch(`/api/admin/orders/${orderId}/status`, { status });
      setOrders(os => os.map(o => o.id === orderId ? { ...o, status: data.status } : o));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.15rem' }}>Orders</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{orders.length} total orders</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td>{order.profile?.full_name || 'Customer'}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {order.order_items?.slice(0, 2).map(item => (
                      <span key={item.id} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {item.product?.name} × {item.quantity}
                      </span>
                    ))}
                    {order.order_items?.length > 2 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        +{order.order_items.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--accent-light)' }}>${Number(order.total).toFixed(2)}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    id={`admin-order-status-${order.id}`}
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
