import { initialMockBanners } from "../data/mockBanners";
const STORAGE_KEY = "thelenshut_banners";
const loadBanners = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockBanners));
    return initialMockBanners;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialMockBanners;
  }
};
const saveBanners = (banners) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
};
const bannerService = {
  getBanners: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return loadBanners();
  },
  createBanner: async (bannerData) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const banners = loadBanners();
    const newBanner = {
      ...bannerData,
      id: `ban-${Date.now().toString(36)}`
    };
    const updated = [...banners, newBanner];
    saveBanners(updated);
    return newBanner;
  },
  updateBanner: async (id, updates) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const banners = loadBanners();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Banner not found");
    }
    const updatedBanner = {
      ...banners[index],
      ...updates
    };
    banners[index] = updatedBanner;
    saveBanners(banners);
    return updatedBanner;
  },
  toggleBanner: async (id) => {
    const banners = loadBanners();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Banner not found");
    return bannerService.updateBanner(id, { isActive: !banners[index].isActive });
  },
  deleteBanner: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const banners = loadBanners();
    const filtered = banners.filter((b) => b.id !== id);
    saveBanners(filtered);
    return true;
  }
};
export {
  bannerService
};
