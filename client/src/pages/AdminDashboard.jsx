import { useOutletContext, Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { stats, statsLoading } = useOutletContext();

  const statCards = [
    { label: 'Revenue', value: statsLoading ? '—' : `$${stats?.totalRevenue || '0.00'}` },
    { label: 'Orders', value: statsLoading ? '—' : stats?.totalOrders || 0 },
    { label: 'Products', value: statsLoading ? '—' : stats?.totalProducts || 0 },
    { label: 'Customers', value: statsLoading ? '—' : stats?.totalUsers || 0 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '4px' }}>Dashboard</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '28px' }}>Store performance at a glance</p>

      <div className="admin-grid-4" style={{ marginBottom: '28px' }}>
        {statCards.map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/admin/products"><button className="btn btn-primary btn-sm">Add Product</button></Link>
          <Link to="/admin/orders"><button className="btn btn-secondary btn-sm">View Orders</button></Link>
          <Link to="/products"><button className="btn btn-ghost btn-sm" style={{ textDecoration: 'underline' }}>View Store</button></Link>
        </div>
      </div>
    </div>
  );
}
