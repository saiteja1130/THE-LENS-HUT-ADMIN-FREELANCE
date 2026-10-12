const initialMockDashboardStats = {
  totalSales: 0,
  totalOrders: 0,
  todayOrders: 0,
  totalProducts: 0,
  lowStockProducts: 0,
  registeredCustomers: 0
};

const mockSalesChartWeekly = [
  { date: "Mon", sales: 0, orders: 0 },
  { date: "Tue", sales: 0, orders: 0 },
  { date: "Wed", sales: 0, orders: 0 },
  { date: "Thu", sales: 0, orders: 0 },
  { date: "Fri", sales: 0, orders: 0 },
  { date: "Sat", sales: 0, orders: 0 },
  { date: "Sun", sales: 0, orders: 0 }
];

const mockSalesChartMonthly = [
  { date: "Jan", sales: 0, orders: 0 },
  { date: "Feb", sales: 0, orders: 0 },
  { date: "Mar", sales: 0, orders: 0 },
  { date: "Apr", sales: 0, orders: 0 },
  { date: "May", sales: 0, orders: 0 },
  { date: "Jun", sales: 0, orders: 0 },
  { date: "Jul", sales: 0, orders: 0 },
  { date: "Aug", sales: 0, orders: 0 },
  { date: "Sep", sales: 0, orders: 0 },
  { date: "Oct", sales: 0, orders: 0 },
  { date: "Nov", sales: 0, orders: 0 },
  { date: "Dec", sales: 0, orders: 0 }
];

export {
  initialMockDashboardStats,
  mockSalesChartMonthly,
  mockSalesChartWeekly
};
