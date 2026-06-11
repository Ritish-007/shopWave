import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { clearAuth, selectUser, setProfile } from '../features/authSlice';
import { selectCartCount } from '../features/cartSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const profile = useSelector(state => state.auth.profile);
  const cartCount = useSelector(selectCartCount);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (profile?.full_name) {
      setEditName(profile.full_name);
    }
  }, [profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearAuth());
    navigate('/');
  };

  const getInitial = () => {
    if (profile?.full_name && profile.full_name.trim().length > 0) {
      return profile.full_name.trim()[0].toUpperCase();
    }
    if (user?.email) {
      return user.email.trim()[0].toUpperCase();
    }
    return '?';
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: editName })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      if (data) {
        dispatch(setProfile(data));
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess('');
        }, 1000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <>
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
              <div className="nav-profile-wrap" ref={dropdownRef}>
                <button
                  className="nav-avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="nav-avatar-btn"
                  aria-label="Profile Menu"
                >
                  {getInitial()}
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown-menu">
                    <div className="nav-dropdown-header">
                      {profile?.full_name || 'Customer'}
                    </div>
                    <button
                      className="nav-dropdown-item"
                      onClick={() => {
                        setIsModalOpen(true);
                        setDropdownOpen(false);
                        setError('');
                        setSuccess('');
                      }}
                      id="dropdown-edit-btn"
                    >
                      ✏️ Edit Details
                    </button>
                    {isAdmin && (
                      <button
                        className="nav-dropdown-item"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/admin');
                        }}
                        id="dropdown-admin-btn"
                      >
                        🛠️ Admin Panel
                      </button>
                    )}
                    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                    <button
                      className="nav-dropdown-item logout-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      id="dropdown-logout-btn"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
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

      {/* Edit Details Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Details</h3>
              <button 
                className="btn-icon" 
                onClick={() => setIsModalOpen(false)} 
                aria-label="Close"
                style={{ background: 'transparent', border: 'none', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                <div className="profile-avatar-premium" style={{ width: '64px', height: '64px', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                  {getInitial()}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit' }}>
                    {profile?.full_name || 'Valued Customer'}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" htmlFor="edit-navbar-name">Full Name</label>
                <input
                  id="edit-navbar-name"
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your Full Name"
                  required
                  autoFocus
                />
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <strong>Role:</strong>{' '}
                  <span className={`badge ${profile?.role === 'admin' ? 'badge-dark' : 'badge-success'}`} style={{ marginLeft: '4px' }}>
                    {profile?.role || 'customer'}
                  </span>
                </div>
                {profile?.created_at && (
                  <div>
                    <strong>Member Since:</strong>{' '}
                    {new Date(profile.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom: '16px', padding: '8px 12px' }}>{error}</div>}
              {success && <div className="alert alert-success" style={{ marginBottom: '16px', padding: '8px 12px' }}>{success}</div>}

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
