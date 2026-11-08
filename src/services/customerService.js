import { api } from './api';
import { orderService } from "./orderService";

const customerService = {
  getCustomers: async () => {
    try {
      const res = await api.get('/users/admin/users');
      if (res.data?.success && Array.isArray(res.data?.data?.users) && res.data.data.users.length > 0) {
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
      console.warn('[CustomerService] Failed to load users:', err.message);
    }
    return [];
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
      console.warn('[CustomerService] Failed to load user by ID:', err.message);
    }
    return null;
  },

  getCustomerOrders: async (customerId) => {
    const orders = await orderService.getOrders();
    return orders.filter((o) => o.customer?.id === customerId);
  },
};

export { customerService };
