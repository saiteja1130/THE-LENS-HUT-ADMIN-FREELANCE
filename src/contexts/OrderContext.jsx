import { createContext, useState, useEffect, useCallback } from "react";
import { orderService } from "../services/orderService";
const OrderContext = createContext(void 0);
const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const updateOrderStatus = async (id, status) => {
    try {
      const updated = await orderService.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? updated : o));
      return updated;
    } catch (err) {
      throw err;
    }
  };
  const updateTracking = async (id, courierName, trackingId) => {
    try {
      const updated = await orderService.updateTracking(id, courierName, trackingId);
      setOrders((prev) => prev.map((o) => o.id === id ? updated : o));
      return updated;
    } catch (err) {
      throw err;
    }
  };
  const getOrder = (id) => {
    return orders.find((o) => o.id === id || o.orderNumber === id);
  };
  return <OrderContext.Provider
    value={{
      orders,
      loading,
      error,
      updateOrderStatus,
      updateTracking,
      getOrder,
      refreshOrders: fetchOrders
    }}
  >
      {children}
    </OrderContext.Provider>;
};
export {
  OrderContext,
  OrderProvider
};
