import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { clearAuth, selectUser, selectIsAdmin } from '../features/authSlice';
import { selectCartCount } from '../features/cartSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const cartCount = useSelector(selectCartCount);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearAuth());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" id="navbar-logo">ShopWave</Link>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Shop</NavLink>
          {user && <NavLink to="/orders" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Admin</NavLink>}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-badge-wrap">
            <button className="btn-icon" id="nav-cart-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {user ? (
            <button onClick={handleLogout} className="btn btn-secondary btn-sm" id="nav-logout-btn">
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-ghost btn-sm" id="nav-login-btn">Sign in</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary btn-sm" id="nav-register-btn">Join us</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
