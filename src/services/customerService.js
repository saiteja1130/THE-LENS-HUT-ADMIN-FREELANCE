import { api } from './api';
import { initialMockCustomers } from "../data/mockCustomers";
import { orderService } from "./orderService";

const STORAGE_KEY = "thelenshut_customers";

const loadCustomers = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return [];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.filter((c) => !c.id?.startsWith('cust-00')) : [];
  } catch {
    return [];
  }
};

const customerService = {
  getCustomers: async () => {
    try {
      const res = await api.get('/users/admin/users');
      if (res.data?.success && res.data?.data?.users?.length > 0) {
        return res.data.data.users.map((u) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          phone: u.phone || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          status: u.isEmailVerified ? 'Active' : 'Unverified',
          role: u.role,
          joinedDate: new Date(u.createdAt).toLocaleDateString(),
        }));
      }
    } catch (err) {
      // Fallback to local data
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    return loadCustomers();
  },

  getCustomerById: async (id) => {
    try {
      const res = await api.get(`/users/admin/users/${id}`);
      if (res.data?.success && res.data?.data?.user) {
        const u = res.data.data.user;
        return {
          id: u.id,
          name: u.fullName,
          email: u.email,
          phone: u.phone || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          status: u.isEmailVerified ? 'Active' : 'Unverified',
          role: u.role,
          joinedDate: new Date(u.createdAt).toLocaleDateString(),
        };
      }
    } catch (err) {
      // Fallback
    }
    const customers = loadCustomers();
    const customer = customers.find((c) => c.id === id);
    return customer || null;
  },

  getCustomerOrders: async (customerId) => {
    const orders = await orderService.getOrders();
    return orders.filter((o) => o.customer.id === customerId);
  },
};

export { customerService };
