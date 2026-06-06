import { useEffect, useState } from 'react';
import api from '../lib/api';

const emptyForm = { name: '', description: '', price: '', image_url: '', category: '', stock: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/api/admin/products')
      .then(r => setProducts(r.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditProduct(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setForm({ name: p.name, description: p.description || '', price: p.price, image_url: p.image_url || '', category: p.category || '', stock: p.stock }); setError(''); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
    try {
      if (editProduct) {
        await api.put(`/api/admin/products/${editProduct.id}`, payload);
      } else {
        await api.post('/api/admin/products', payload);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts(ps => ps.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete product');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.15rem' }}>Products</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{products.length} total products</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="admin-add-product-btn">+ Add Product</button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

      {loading ? (
        <div className="loading-center"><div className="spinner"></div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <img
                      className="table-img"
                      src={p.image_url || `https://picsum.photos/seed/${p.id}/80/80`}
                      alt={p.name}
                    />
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td><span className="badge badge-muted">{p.category || '—'}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-light)' }}>${Number(p.price).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)} id={`admin-edit-${p.id}`}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)} id={`admin-delete-${p.id}`}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)} id="admin-product-modal-close">✕</button>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required id="admin-product-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} id="admin-product-desc" style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input type="number" step="0.01" min="0" className="form-input" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required id="admin-product-price" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock *</label>
                    <input type="number" min="0" className="form-input" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required id="admin-product-stock" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Electronics, Clothing, etc." id="admin-product-category" />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input type="url" className="form-input" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." id="admin-product-image" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} id="admin-product-save-btn">
                  {saving ? 'Saving...' : editProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
