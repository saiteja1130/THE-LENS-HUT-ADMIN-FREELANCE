import { api } from './api';

const bannerService = {
  getBanners: async () => {
    try {
      const res = await api.get('/banners/admin/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[BannerService] Failed to fetch banners:', err.message);
    }
    return [];
  },

  createBanner: async (bannerData) => {
    const res = await api.post('/banners', bannerData);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to create banner');
  },

  updateBanner: async (id, updates) => {
    const res = await api.put(`/banners/${id}`, updates);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to update banner');
  },

  toggleBanner: async (id) => {
    const res = await api.patch(`/banners/${id}/toggle`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to toggle banner');
  },

  deleteBanner: async (id) => {
    const res = await api.delete(`/banners/${id}`);
    if (res.data?.success) {
      return true;
    }
    throw new Error(res.data?.message || 'Failed to delete banner');
  },

  reorderBanners: async (orderList) => {
    const res = await api.put('/banners/admin/reorder', { orderList });
    if (res.data?.success) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to reorder banners');
  },
};

export { bannerService };
