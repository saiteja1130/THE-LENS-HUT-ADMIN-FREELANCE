import { api } from './api';

const normalizeProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    id: p.id || p._id,
  };
};

export const productService = {
  getProducts: async () => {
    try {
      const res = await api.get('/products/admin/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data.map(normalizeProduct);
      }
    } catch (err) {
      console.warn('[ProductService] Backend unreachable:', err.message);
    }
    return [];
  },

  getProductById: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data?.success && res.data.data) {
        return normalizeProduct(res.data.data);
      }
    } catch (err) {
      console.warn('[ProductService] Fetch by ID failed:', err.message);
    }
    return null;
  },

  createProduct: async (productData) => {
    const isFormData = typeof FormData !== 'undefined' && productData instanceof FormData;
    const res = await api.post('/products', productData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    if (res.data?.success && res.data.data) {
      return normalizeProduct(res.data.data);
    }
    throw new Error(res.data?.message || 'Failed to create product');
  },

  updateProduct: async (id, updates) => {
    const isFormData = typeof FormData !== 'undefined' && updates instanceof FormData;
    const res = await api.put(`/products/${id}`, updates, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    if (res.data?.success && res.data.data) {
      return normalizeProduct(res.data.data);
    }
    throw new Error(res.data?.message || 'Failed to update product');
  },


  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    if (res.data?.success) {
      return true;
    }
    throw new Error(res.data?.message || 'Failed to delete product');
  },

  updateStock: async (id, stock) => {
    const res = await api.patch(`/products/${id}/stock`, { stock });
    if (res.data?.success) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to update stock');
  },
};

export default productService;
