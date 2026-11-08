import { api } from './api';

const categoryService = {
  getCategories: async () => {
    try {
      const res = await api.get('/categories/admin/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[CategoryService] Failed to load categories:', err.message);
    }
    return [];
  },

  createCategory: async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to create category');
  },

  updateCategory: async (id, updates) => {
    const res = await api.put(`/categories/${id}`, updates);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to update category');
  },

  toggleCategory: async (id) => {
    const res = await api.patch(`/categories/${id}/toggle`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to toggle category');
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    if (res.data?.success) {
      return true;
    }
    throw new Error(res.data?.message || 'Failed to delete category');
  },

  reorderCategories: async (orderList) => {
    const res = await api.put('/categories/admin/reorder', { orderList });
    if (res.data?.success) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to reorder categories');
  },
};

export { categoryService };
