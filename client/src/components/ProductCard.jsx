import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../features/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
      id={`product-card-${product.id}`}
    >
      <div className="product-card-img">
        <img
          src={product.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop`}
          alt={product.name}
          loading="lazy"
        />
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-price">${Number(product.price).toFixed(2)}</div>
      </div>
    </div>
  );
}
