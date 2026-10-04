import { createContext, useState, useEffect, useCallback } from "react";
import { couponService } from "../services/couponService";
const CouponContext = createContext(void 0);
const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await couponService.getCoupons();
      setCoupons(data);
    } catch {
      setError("Failed to load coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);
  const addCoupon = async (couponData) => {
    try {
      const created = await couponService.createCoupon(couponData);
      setCoupons((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw err;
    }
  };
  const updateCoupon = async (id, updates) => {
    try {
      const updated = await couponService.updateCoupon(id, updates);
      setCoupons((prev) => prev.map((c) => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      throw err;
    }
  };
  const deleteCoupon = async (id) => {
    try {
      await couponService.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      throw err;
    }
  };
  return <CouponContext.Provider
    value={{
      coupons,
      loading,
      error,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      refreshCoupons: fetchCoupons
    }}
  >
      {children}
    </CouponContext.Provider>;
};
export {
  CouponContext,
  CouponProvider
};
