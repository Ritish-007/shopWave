import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.min_price) params.append('min_price', filters.min_price);
  if (filters.max_price) params.append('max_price', filters.max_price);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.order) params.append('order', filters.order);

  const { data } = await api.get(`/api/products?${params}`);
  return data;
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id) => {
  const { data } = await api.get(`/api/products/${id}`);
  return data;
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const { data } = await api.get('/api/products/categories');
  return data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    current: null,
    categories: [],
    filters: { category: '', search: '', sort: 'created_at', order: 'desc' },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; state.current = null; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchProduct.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; });
  },
});

export const { setFilters, clearCurrent } = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectCurrentProduct = (state) => state.products.current;
export const selectCategories = (state) => state.products.categories;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductsLoading = (state) => state.products.loading;

export default productsSlice.reducer;
