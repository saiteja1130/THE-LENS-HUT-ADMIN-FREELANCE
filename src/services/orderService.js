import { api } from "./api";

const orderService = {
  /**
   * Fetch all orders from backend
   */
  getOrders: async () => {
    try {
      const res = await api.get('/orders/admin/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[Admin orderService] Server fetch failed:', err.message);
    }
    return [];
  },

  /**
   * Fetch order by identifier
   */
  getOrderById: async (id) => {
    try {
      const res = await api.get(`/orders/${encodeURIComponent(id)}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[Admin orderService] Server fetch by ID failed:', err.message);
    }
    return null;
  },

  /**
   * Update order status with backend synchronization
   */
  updateOrderStatus: async (id, status) => {
    const res = await api.patch(`/orders/admin/${encodeURIComponent(id)}/status`, { status });
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to update order status');
  },

  /**
   * Update courier tracking details
   */
  updateTracking: async (id, courierName, trackingId) => {
    const res = await api.patch(`/orders/admin/${encodeURIComponent(id)}/tracking`, {
      courierName,
      trackingId,
    });
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to update tracking');
  },
};

export { orderService };
