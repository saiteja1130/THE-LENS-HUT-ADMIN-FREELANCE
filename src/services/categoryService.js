import { api } from './api';

const STORAGE_KEY = "thelenshut_categories";

const loadFallbackCategories = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return [];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.filter((c) => !c.id?.startsWith('cat-00')) : [];
  } catch {
    return [];
  }
};

const saveFallbackCategories = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

const categoryService = {
  getCategories: async () => {
    try {
      const res = await api.get('/categories/admin/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        saveFallbackCategories(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('[CategoryService] Falling back to local cache:', err.message);
    }
    return loadFallbackCategories();
  },

  createCategory: async (categoryData) => {
    try {
      const res = await api.post('/categories', categoryData);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[CategoryService] Creating category locally:', err.message);
    }
    const categories = loadFallbackCategories();
    const newCategory = {
      ...categoryData,
      id: `cat-${Date.now().toString(36)}`,
      order: categories.length + 1,
    };
    const updated = [...categories, newCategory];
    saveFallbackCategories(updated);
    return newCategory;
  },

  updateCategory: async (id, updates) => {
    try {
      const res = await api.put(`/categories/${id}`, updates);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[CategoryService] Updating category locally:', err.message);
    }
    const categories = loadFallbackCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");
    const updatedCategory = {
      ...categories[index],
      ...updates,
    };
    categories[index] = updatedCategory;
    saveFallbackCategories(categories);
    return updatedCategory;
  },

  toggleCategory: async (id) => {
    try {
      const res = await api.patch(`/categories/${id}/toggle`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[CategoryService] Toggling category locally:', err.message);
    }
    const categories = loadFallbackCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");
    return categoryService.updateCategory(id, { isActive: !categories[index].isActive });
  },

  deleteCategory: async (id) => {
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data?.success) {
        return true;
      }
    } catch (err) {
      console.warn('[CategoryService] Deleting category locally:', err.message);
    }
    const categories = loadFallbackCategories();
    const filtered = categories.filter((c) => c.id !== id);
    saveFallbackCategories(filtered);
    return true;
  },

  reorderCategories: async (orderList) => {
    try {
      const res = await api.put('/categories/admin/reorder', { orderList });
      if (res.data?.success) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[CategoryService] Reordering categories locally:', err.message);
    }
    return loadFallbackCategories();
  },
};

export { categoryService };
