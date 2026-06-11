import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productsSlice';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featured = products.slice(0, 4);

  return (
    <main>

      {/* Hero — clean text-only */}
      <section className="hero">
        <div className="container">
          <div className="hero-content" style={{ maxWidth: '100%', textAlign: 'center', margin: '0 auto' }}>
            <div className="hero-eyebrow">New Arrivals</div>
            <h1>Discover What's Next</h1>
            <p style={{ maxWidth: '480px', margin: '0 auto 32px' }}>
              Shop the latest collection of premium essentials — designed for everyday excellence.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link to="/products">
                <button className="btn btn-primary btn-lg" id="hero-shop-btn">Shop Now</button>
              </Link>
              <Link to="/products">
                <button className="btn btn-secondary btn-lg" id="hero-explore-btn">Explore</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2>Trending Now</h2>
            <Link to="/products">
              <button className="btn btn-secondary btn-sm" id="home-view-all-btn">View All</button>
            </Link>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>The ShopWave Difference</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🔒', title: 'Secure Checkout', desc: 'Every transaction is encrypted and protected end-to-end.' },
              { icon: '🚚', title: 'Free Shipping', desc: 'Complimentary shipping on all orders over $100.' },
              { icon: '↩️', title: '30-Day Returns', desc: 'Not happy? Return any item within 30 days, no questions asked.' },
              { icon: '💬', title: '24/7 Support', desc: 'Our team is available around the clock to help you out.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">ShopWave</div>
            <div className="footer-copy" style={{ marginTop: '4px' }}>© 2025 ShopWave. All rights reserved.</div>
          </div>
          <div className="footer-links">
            <Link to="/products" className="footer-link">Shop</Link>
            <Link to="/orders" className="footer-link">Orders</Link>
            <span className="footer-link">Privacy</span>
            <span className="footer-link">Terms</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
