import { createContext, useState, useEffect, useCallback } from "react";
import { bannerService } from "../services/bannerService";
const BannerContext = createContext(void 0);
const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bannerService.getBanners();
      setBanners(data);
    } catch {
      setError("Failed to load banners. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);
  const addBanner = async (bannerData) => {
    try {
      const created = await bannerService.createBanner(bannerData);
      setBanners((prev) => [...prev, created]);
      return created;
    } catch (err) {
      throw err;
    }
  };
  const updateBanner = async (id, updates) => {
    try {
      const updated = await bannerService.updateBanner(id, updates);
      setBanners((prev) => prev.map((b) => b.id === id ? updated : b));
      return updated;
    } catch (err) {
      throw err;
    }
  };
  const toggleBanner = async (id) => {
    try {
      const updated = await bannerService.toggleBanner(id);
      setBanners((prev) => prev.map((b) => b.id === id ? updated : b));
      return updated;
    } catch (err) {
      throw err;
    }
  };
  const deleteBanner = async (id) => {
    try {
      await bannerService.deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err) {
      throw err;
    }
  };
  return <BannerContext.Provider
    value={{
      banners,
      loading,
      error,
      addBanner,
      updateBanner,
      deleteBanner,
      toggleBanner,
      refreshBanners: fetchBanners
    }}
  >
      {children}
    </BannerContext.Provider>;
};
export {
  BannerContext,
  BannerProvider
};
