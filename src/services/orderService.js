import { initialMockOrders } from "../data/mockOrders";
const STORAGE_KEY = "thelenshut_orders";
const loadOrders = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockOrders));
    return initialMockOrders;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialMockOrders;
  }
};
const saveOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};
const orderService = {
  getOrders: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return loadOrders();
  },
  getOrderById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const orders = loadOrders();
    const order = orders.find((o) => o.id === id || o.orderNumber === id);
    return order || null;
  },
  updateOrderStatus: async (id, status) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const orders = loadOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    const updatedOrder = {
      ...orders[index],
      orderStatus: status
    };
    orders[index] = updatedOrder;
    saveOrders(orders);
    return updatedOrder;
  },
  updateTracking: async (id, courierName, trackingId) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const orders = loadOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    const updatedOrder = {
      ...orders[index],
      tracking: {
        courierName,
        trackingId,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    orders[index] = updatedOrder;
    saveOrders(orders);
    return updatedOrder;
  }
};
export {
  orderService
};
