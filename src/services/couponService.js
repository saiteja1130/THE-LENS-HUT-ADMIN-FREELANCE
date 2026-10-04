import { initialMockCoupons } from "../data/mockCoupons";
const STORAGE_KEY = "thelenshut_coupons";
const loadCoupons = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockCoupons));
    return initialMockCoupons;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialMockCoupons;
  }
};
const saveCoupons = (coupons) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
};
const couponService = {
  getCoupons: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return loadCoupons();
  },
  createCoupon: async (couponData) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const coupons = loadCoupons();
    const newCoupon = {
      ...couponData,
      id: `cpn-${Date.now().toString(36)}`,
      usageCount: 0
    };
    const updated = [newCoupon, ...coupons];
    saveCoupons(updated);
    return newCoupon;
  },
  updateCoupon: async (id, updates) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const coupons = loadCoupons();
    const index = coupons.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Coupon not found");
    }
    const updatedCoupon = {
      ...coupons[index],
      ...updates
    };
    coupons[index] = updatedCoupon;
    saveCoupons(coupons);
    return updatedCoupon;
  },
  deleteCoupon: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const coupons = loadCoupons();
    const filtered = coupons.filter((c) => c.id !== id);
    saveCoupons(filtered);
    return true;
  }
};
export {
  couponService
};
