import { api } from './api';

const brandService = {
  getBrandsAdmin: async () => {
    try {
      const res = await api.get('/brands/admin/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[BrandService] Failed to load brands:', err.message);
    }
    return [];
  },

  getActiveBrands: async () => {
    try {
      const res = await api.get('/brands');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[BrandService] Failed to load active brands:', err.message);
    }
    return [];
  },

  createBrand: async (brandData) => {
    const res = await api.post('/brands', brandData);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to create brand');
  },

  updateBrand: async (id, updates) => {
    const res = await api.put(`/brands/${id}`, updates);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to update brand');
  },

  toggleBrand: async (id) => {
    const res = await api.patch(`/brands/${id}/toggle`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to toggle brand status');
  },

  deleteBrand: async (id) => {
    const res = await api.delete(`/brands/${id}`);
    if (res.data?.success) {
      return true;
    }
    throw new Error(res.data?.message || 'Failed to delete brand');
  },
};

export { brandService };
export default brandService;
