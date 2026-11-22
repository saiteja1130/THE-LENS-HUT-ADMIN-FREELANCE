import { api } from './api';

const couponService = {
  getCoupons: async () => {
    const res = await api.get('/coupons/admin/all');
    if (res.data?.success && Array.isArray(res.data.data)) {
      const serverCoupons = res.data.data;
      if (serverCoupons.length || localStorage.getItem('thelenshut_coupons_migrated')) return serverCoupons;
      try {
        const legacyCoupons = JSON.parse(localStorage.getItem('thelenshut_coupons') || '[]');
        for (const coupon of legacyCoupons) {
          await api.post('/coupons', {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderAmount: coupon.minOrderAmount || 0,
            startDate: coupon.startDate,
            expiryDate: coupon.expiryDate,
            isActive: coupon.isActive,
          });
        }
      } catch (error) {
        console.warn('[CouponService] Legacy coupon migration stopped:', error.message);
      } finally {
        localStorage.setItem('thelenshut_coupons_migrated', 'true');
      }
      const migrated = await api.get('/coupons/admin/all');
      if (migrated.data?.success && Array.isArray(migrated.data.data)) return migrated.data.data;
      return serverCoupons;
    }
    throw new Error(res.data?.message || 'Failed to load coupons');
  },
  createCoupon: async (couponData) => {
    const res = await api.post('/coupons', couponData);
    if (res.data?.success && res.data.data) return res.data.data;
    throw new Error(res.data?.message || 'Failed to create coupon');
  },
  updateCoupon: async (id, updates) => {
    const res = await api.put(`/coupons/${id}`, updates);
    if (res.data?.success && res.data.data) return res.data.data;
    throw new Error(res.data?.message || 'Failed to update coupon');
  },
  deleteCoupon: async (id) => {
    const res = await api.delete(`/coupons/${id}`);
    if (res.data?.success) return true;
    throw new Error(res.data?.message || 'Failed to delete coupon');
  }
};
export {
  couponService
};
