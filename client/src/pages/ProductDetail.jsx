import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, clearCurrent, selectCurrentProduct, selectProductsLoading } from '../features/productsSlice';
import { addToCart } from '../features/cartSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="loading-center page"><div className="spinner"></div></div>;
  if (!product) return (
    <div className="page loading-center">
      <div className="empty-state">
        <h3>Product not found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '16px' }}>Browse Products</button>
      </div>
    </div>
  );

  return (
    <main className="page">
      <div className="container">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '24px', fontSize: '0.85rem' }}
          id="product-back-btn"
        >
          ← Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Image */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-secondary)', aspectRatio: '1' }}>
            <img
              src={product.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop`}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Info */}
          <div style={{ paddingTop: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              {product.category}
            </div>
            <h1 style={{ marginBottom: '12px', fontSize: '2rem' }}>{product.name}</h1>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>
              ${Number(product.price).toFixed(2)}
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px', fontSize: '0.9rem' }}>
              {product.description || 'No description available.'}
            </p>

            {/* Quantity + Add to cart */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} id="detail-qty-dec">−</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock} id="detail-qty-inc">+</button>
              </div>
              <span style={{ fontSize: '0.8rem', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              id="product-add-to-cart-btn"
              style={{ marginBottom: '12px' }}
            >
              {added ? 'Added to Bag ✓' : 'Add to Bag'}
            </button>

            {/* Details */}
            <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Free Shipping', sub: 'Orders over $100' },
                  { label: 'Easy Returns', sub: '30-day policy' },
                  { label: 'Secure Checkout', sub: 'SSL encrypted' },
                ].map(d => (
                  <div key={d.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '2px' }}>{d.label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{d.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
