import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../features/cartSlice';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const { product, quantity } = item;

  return (
    <div className="cart-item-row">
      <div className="cart-item-img">
        <img
          src={product.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop`}
          alt={product.name}
        />
      </div>
      <div className="cart-item-info">
        <div className="cart-item-name">{product.name}</div>
        <div className="cart-item-price">${Number(product.price).toFixed(2)}</div>
        <div style={{ marginTop: '8px' }}>
          <div className="qty-control">
            <button
              className="qty-btn"
              onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))}
              id={`cart-qty-dec-${product.id}`}
            >−</button>
            <span className="qty-value">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
              disabled={quantity >= product.stock}
              id={`cart-qty-inc-${product.id}`}
            >+</button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
          ${(product.price * quantity).toFixed(2)}
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => dispatch(removeFromCart(product.id))}
          id={`cart-remove-${product.id}`}
          style={{ color: 'var(--text-muted)', textDecoration: 'underline', padding: '4px 0', fontSize: '0.75rem' }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
