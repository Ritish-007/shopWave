import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthLoading } from '../features/authSlice';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const profile = useSelector(state => state.auth.profile);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
