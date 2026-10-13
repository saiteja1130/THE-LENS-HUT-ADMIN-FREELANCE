import { api } from "./api";

const STORAGE_KEY = "thelenshut_orders";

const loadOrders = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return [];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.filter((o) => !o.id?.startsWith('ord-00')) : [];
  } catch {
    return [];
  }
};

const saveOrders = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Ignore quota errors
  }
};

const orderService = {
  /**
   * Fetch all orders with real-time backend synchronization and offline fallback
   */
  getOrders: async () => {
    try {
      const res = await api.get('/orders/admin/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        saveOrders(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('[Admin orderService] Server fetch failed, falling back to local cache:', err.message);
    }
    return loadOrders();
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
      console.warn('[Admin orderService] Server fetch by ID failed, falling back to local cache:', err.message);
    }
    const orders = loadOrders();
    const order = orders.find((o) => o.id === id || o.orderNumber === id);
    return order || null;
  },

  /**
   * Update order status with inventory synchronization
   */
  updateOrderStatus: async (id, status) => {
    let updatedOrder = null;
    try {
      const res = await api.patch(`/orders/admin/${encodeURIComponent(id)}/status`, { status });
      if (res.data?.success && res.data.data) {
        updatedOrder = res.data.data;
      }
    } catch (err) {
      console.warn('[Admin orderService] Server status update failed, saving locally:', err.message);
    }

    const orders = loadOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index !== -1) {
      orders[index] = updatedOrder ? { ...orders[index], ...updatedOrder, orderStatus: status, status } : {
        ...orders[index],
        orderStatus: status,
        status,
      };
      saveOrders(orders);
      return orders[index];
    } else if (updatedOrder) {
      saveOrders([updatedOrder, ...orders]);
      return updatedOrder;
    }
    throw new Error("Order not found");
  },

  /**
   * Update courier tracking details
   */
  updateTracking: async (id, courierName, trackingId) => {
    let updatedOrder = null;
    try {
      const res = await api.patch(`/orders/admin/${encodeURIComponent(id)}/tracking`, {
        courierName,
        trackingId,
      });
      if (res.data?.success && res.data.data) {
        updatedOrder = res.data.data;
      }
    } catch (err) {
      console.warn('[Admin orderService] Server tracking update failed, saving locally:', err.message);
    }

    const orders = loadOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index !== -1) {
      orders[index] = updatedOrder ? { ...orders[index], ...updatedOrder } : {
        ...orders[index],
        tracking: {
          courierName,
          trackingId,
          updatedAt: new Date().toISOString(),
        },
        trackingNumber: trackingId,
      };
      saveOrders(orders);
      return orders[index];
    } else if (updatedOrder) {
      saveOrders([updatedOrder, ...orders]);
      return updatedOrder;
    }
    throw new Error("Order not found");
  },
};

export { orderService };
export default orderService;
