import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useDispatch } from 'react-redux';
import { supabase } from './lib/supabase';
import { setSession, setProfile, clearAuth, setLoading } from './features/authSlice';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';

function AppInner() {
  const dispatch = useDispatch();

  // Helper to fetch the profile row and dispatch it
  // Returns true if profile was set successfully
  async function loadProfile(userId, session) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.warn('Profile fetch error (non-fatal):', error.message);
        // Fallback: build a minimal profile from session metadata
        const meta = session?.user?.user_metadata || {};
        dispatch(setProfile({
          id: userId,
          full_name: meta.full_name || meta.name || null,
          role: meta.role || 'customer',
        }));
        return false;
      }
      if (profile) {
        dispatch(setProfile(profile));
        return true;
      }
    } catch (err) {
      console.warn('loadProfile threw:', err);
    }
    return false;
  }

  useEffect(() => {
    // Initialize auth from existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session?.user) {
          await loadProfile(session.user.id, session);
        }
      } finally {
        dispatch(setSession(session));
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        dispatch(clearAuth());
      } else if (session?.user) {
        await loadProfile(session.user.id, session);
        dispatch(setSession(session));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/checkout" element={
          <ProtectedRoute><Checkout /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
