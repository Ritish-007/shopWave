import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { selectUser } from '../features/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // The global auth listener in App.jsx will handle setting session and profile.
      // We just navigate to the home page.
      navigate('/');
    } catch (err) {
      console.error('Login submit error:', err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>ShopWave</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px', fontFamily: 'Inter' }}>
            Sign in to your account
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input id="login-email" name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input id="login-password" name="password" type="password" className="form-input" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="login-submit-btn">
            {loading ? <><span className="spinner spinner-sm"></span> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          Not a member? <Link to="/register">Join us.</Link>
        </div>
      </div>
    </div>
  );
}
