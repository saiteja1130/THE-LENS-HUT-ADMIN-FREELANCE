import { api } from './api';

const STORAGE_KEY = "thelenshut_banners";

const loadFallbackBanners = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return [];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.filter((b) => !b.id?.startsWith('ban-00')) : [];
  } catch {
    return [];
  }
};

const saveFallbackBanners = (banners) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
};

const bannerService = {
  getBanners: async () => {
    try {
      const res = await api.get('/banners/admin/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        saveFallbackBanners(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('[BannerService] Falling back to local storage cache:', err.message);
    }
    return loadFallbackBanners();
  },

  createBanner: async (bannerData) => {
    try {
      const res = await api.post('/banners', bannerData);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[BannerService] Creating banner locally:', err.message);
    }
    const banners = loadFallbackBanners();
    const newBanner = {
      ...bannerData,
      id: `ban-${Date.now().toString(36)}`,
    };
    const updated = [...banners, newBanner];
    saveFallbackBanners(updated);
    return newBanner;
  },

  updateBanner: async (id, updates) => {
    try {
      const res = await api.put(`/banners/${id}`, updates);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[BannerService] Updating banner locally:', err.message);
    }
    const banners = loadFallbackBanners();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Banner not found");
    }
    const updatedBanner = {
      ...banners[index],
      ...updates,
    };
    banners[index] = updatedBanner;
    saveFallbackBanners(banners);
    return updatedBanner;
  },

  toggleBanner: async (id) => {
    try {
      const res = await api.patch(`/banners/${id}/toggle`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[BannerService] Toggling banner locally:', err.message);
    }
    const banners = loadFallbackBanners();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Banner not found");
    return bannerService.updateBanner(id, { isActive: !banners[index].isActive });
  },

  deleteBanner: async (id) => {
    try {
      const res = await api.delete(`/banners/${id}`);
      if (res.data?.success) {
        return true;
      }
    } catch (err) {
      console.warn('[BannerService] Deleting banner locally:', err.message);
    }
    const banners = loadFallbackBanners();
    const filtered = banners.filter((b) => b.id !== id);
    saveFallbackBanners(filtered);
    return true;
  },

  reorderBanners: async (orderList) => {
    try {
      const res = await api.put('/banners/admin/reorder', { orderList });
      if (res.data?.success) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[BannerService] Reordering banners locally:', err.message);
    }
    return loadFallbackBanners();
  },
};

export { bannerService };
