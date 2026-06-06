import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin, selectAuthLoading } from '../features/authSlice';
import api from '../lib/api';

export default function Admin() {
  const isAdmin = useSelector(selectIsAdmin);
  const loading = useSelector(selectAuthLoading);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => { if (!loading && !isAdmin) navigate('/'); }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      api.get('/api/admin/stats')
        .then(r => setStats(r.data))
        .catch(console.error)
        .finally(() => setStatsLoading(false));
    }
  }, [isAdmin]);

  if (loading) return <div className="loading-center page"><div className="spinner"></div></div>;
  if (!isAdmin) return null;

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <aside className="admin-sidebar">
        <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '24px', padding: '0 12px', fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          Admin
        </div>

        <div className="admin-sidebar-title">Overview</div>
        <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} id="admin-nav-dashboard">
          Dashboard
        </NavLink>

        <div className="admin-sidebar-title">Catalog</div>
        <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} id="admin-nav-products">
          Products
        </NavLink>

        <div className="admin-sidebar-title">Sales</div>
        <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} id="admin-nav-orders">
          Orders
        </NavLink>

        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
          <NavLink to="/" className="admin-nav-link" id="admin-nav-store">
            ← Back to Store
          </NavLink>
        </div>
      </aside>

      <div className="admin-content">
        <Outlet context={{ stats, statsLoading }} />
      </div>
    </div>
  );
}
