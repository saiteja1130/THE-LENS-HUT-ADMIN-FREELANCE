const initialMockDashboardStats = {
  totalSales: 184590,
  totalOrders: 64,
  todayOrders: 5,
  totalProducts: 48,
  lowStockProducts: 3,
  registeredCustomers: 128
};
const mockSalesChartWeekly = [
  { date: "Mon", sales: 18400, orders: 8 },
  { date: "Tue", sales: 24200, orders: 11 },
  { date: "Wed", sales: 19800, orders: 7 },
  { date: "Thu", sales: 32500, orders: 14 },
  { date: "Fri", sales: 28900, orders: 12 },
  { date: "Sat", sales: 41200, orders: 18 },
  { date: "Sun", sales: 36800, orders: 15 }
];
const mockSalesChartMonthly = [
  { date: "Apr", sales: 112e3, orders: 48 },
  { date: "May", sales: 135400, orders: 56 },
  { date: "Jun", sales: 148900, orders: 62 },
  { date: "Jul", sales: 162300, orders: 70 },
  { date: "Aug", sales: 174500, orders: 74 },
  { date: "Sep", sales: 184590, orders: 81 }
];
export {
  initialMockDashboardStats,
  mockSalesChartMonthly,
  mockSalesChartWeekly
};
