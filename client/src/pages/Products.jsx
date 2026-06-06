import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, setFilters, selectProducts, selectCategories, selectProductFilters, selectProductsLoading } from '../features/productsSlice';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectProductFilters);
  const loading = useSelector(selectProductsLoading);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => { dispatch(fetchProducts(filters)); }, [dispatch, filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput }));
  };

  return (
    <main className="page">
      <div className="container">
        <h1 style={{ marginBottom: '4px' }}>Shop All</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>
          {loading ? 'Loading...' : `${products.length} products`}
        </p>

        {/* Filters */}
        <form className="filters-bar" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrap">
            <span className="icon" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search products..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              id="products-search"
            />
          </div>

          <select className="form-select" value={filters.category} onChange={e => dispatch(setFilters({ category: e.target.value }))} id="products-category-filter">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="form-select"
            value={`${filters.sort}_${filters.order}`}
            onChange={e => { const [sort, order] = e.target.value.split('_'); dispatch(setFilters({ sort, order })); }}
            id="products-sort-filter"
          >
            <option value="created_at_desc">Newest</option>
            <option value="created_at_asc">Oldest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="name_asc">A → Z</option>
          </select>

          <button type="submit" className="btn btn-primary btn-sm" id="products-search-btn">Search</button>
          {(filters.search || filters.category) && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              id="products-clear-btn"
              onClick={() => { setSearchInput(''); dispatch(setFilters({ search: '', category: '', sort: 'created_at', order: 'desc' })); }}
              style={{ textDecoration: 'underline', color: 'var(--text-muted)' }}
            >
              Clear filters
            </button>
          )}
        </form>

        {/* Grid */}
        {loading ? (
          <div className="loading-center"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
