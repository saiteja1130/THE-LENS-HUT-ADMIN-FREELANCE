import { api } from './api';
import { orderService } from "./orderService";

const customerService = {
  getCustomers: async () => {
    try {
      const first = await api.get('/users/admin/users?limit=100&page=1');
      if (first.data?.success && Array.isArray(first.data?.data?.users)) {
        const { totalPages = 1 } = first.data.data;
        const pages = await Promise.all(Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
          api.get(`/users/admin/users?limit=100&page=${index + 2}`)
        ));
        const users = [...first.data.data.users, ...pages.flatMap((page) => page.data?.data?.users || [])];
        const orders = await orderService.getOrders();
        const ordersByUser = new Map();
        for (const order of orders) {
          const userId = String(order.user?._id || order.user || '');
          if (!userId) continue;
          const totals = ordersByUser.get(userId) || { count: 0, spent: 0 };
          totals.count += 1;
          if (order.paymentStatus === 'Paid') totals.spent += Number(order.totalAmount) || 0;
          ordersByUser.set(userId, totals);
        }
        return users.map((u) => {
          const totals = ordersByUser.get(String(u.id)) || { count: 0, spent: 0 };
          return ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          phone: u.phone || 'N/A',
          totalOrders: totals.count,
          totalSpent: totals.spent,
          status: u.isEmailVerified ? 'Active' : 'Unverified',
          role: u.role,
          joinedDate: new Date(u.createdAt).toLocaleDateString(),
        });
        });
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
    return orders.filter((o) => String(o.user?._id || o.user || '') === String(customerId));
  },
};

export { customerService };
