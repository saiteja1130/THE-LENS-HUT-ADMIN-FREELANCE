import { initialMockCustomers } from "../data/mockCustomers";
import { orderService } from "./orderService";
const STORAGE_KEY = "thelenshut_customers";
const loadCustomers = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockCustomers));
    return initialMockCustomers;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialMockCustomers;
  }
};
const customerService = {
  getCustomers: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return loadCustomers();
  },
  getCustomerById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const customers = loadCustomers();
    const customer = customers.find((c) => c.id === id);
    return customer || null;
  },
  getCustomerOrders: async (customerId) => {
    const orders = await orderService.getOrders();
    return orders.filter((o) => o.customer.id === customerId);
  }
};
export {
  customerService
};
