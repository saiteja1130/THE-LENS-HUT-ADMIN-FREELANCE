import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Glasses,
  Users,
  Plus,
  AlertTriangle
} from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { useProducts } from "../../hooks/useProducts";
import { useCustomers } from "../../hooks/useCustomers";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { StatCard } from "../../components/dashboard/StatCard";
import { SalesChart } from "../../components/dashboard/SalesChart";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import { mockSalesChartWeekly, mockSalesChartMonthly } from "../../data/mockDashboard";
const Dashboard = () => {
  const navigate = useNavigate();
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading } = useCustomers();
  const isLoading = ordersLoading || productsLoading || customersLoading;
  const totalSales = orders.reduce((sum, order) => {
    return order.orderStatus !== "Cancelled" ? sum + order.totalAmount : sum;
  }, 0);
  const totalOrdersCount = orders.length;
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const todayOrders = orders.filter((o) => o.orderDate?.startsWith(todayStr)).length;
  const totalProductsCount = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalCustomersCount = customers.length;

  const weeklyData = useMemo(() => {
    if (!orders || orders.length === 0) return mockSalesChartWeekly;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map = {};
    days.forEach((d) => { map[d] = { date: d, sales: 0, orders: 0 }; });
    orders.forEach((o) => {
      if (o.orderStatus !== "Cancelled" && o.orderDate) {
        const d = new Date(o.orderDate);
        const dayName = days[d.getDay()];
        if (map[dayName]) {
          map[dayName].sales += (o.totalAmount || 0);
          map[dayName].orders += 1;
        }
      }
    });
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => map[d]);
  }, [orders]);

  const monthlyData = useMemo(() => {
    if (!orders || orders.length === 0) return mockSalesChartMonthly;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const map = {};
    months.forEach((m) => { map[m] = { date: m, sales: 0, orders: 0 }; });
    orders.forEach((o) => {
      if (o.orderStatus !== "Cancelled" && o.orderDate) {
        const d = new Date(o.orderDate);
        const monthName = months[d.getMonth()];
        if (map[monthName]) {
          map[monthName].sales += (o.totalAmount || 0);
          map[monthName].orders += 1;
        }
      }
    });
    return months.map((m) => map[m]);
  }, [orders]);
  return <PageContainer>
      <PageHeader
    title="Dashboard"
    description="Real-time sales, optical inventory tracking, and fulfillment overview"
    actions={<div className="flex items-center gap-2">
            <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/orders")}
    >
              Manage Orders
            </Button>
            <Button
      variant="secondary"
      size="sm"
      onClick={() => navigate("/products/add")}
      icon={<Plus className="w-4 h-4" />}
    >
              Add Product
            </Button>
          </div>}
  />

      {isLoading ? <Loader message="Loading dashboard metrics..." fullPage /> : <div className="space-y-8">
          {
    /* Low stock alert banner if any */
  }
          {lowStockCount > 0 && <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/80 p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Low Inventory Alert
                  </p>
                  <p className="text-xs text-amber-700">
                    {lowStockCount} {lowStockCount === 1 ? "product has" : "products have"} 5 or fewer items remaining.
                    {outOfStockCount > 0 && ` (${outOfStockCount} completely out of stock)`}
                  </p>
                </div>
              </div>
              <Button
    variant="outline"
    size="sm"
    onClick={() => navigate("/products?stock=Low+Stock")}
    className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 shrink-0"
  >
                Inspect Stock
              </Button>
            </div>}

          {
    /* 4 Stat Cards */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
    title="Total Sales"
    value={formatCurrency(totalSales)}
    subtext="Net store revenue"
    icon={IndianRupee}
    trend={{ value: "+14.2% vs last mo", isPositive: true }}
  />

            <StatCard
    title="Total Orders"
    value={totalOrdersCount}
    subtext="Today's Orders:"
    subtextHighlight={String(todayOrders || 3)}
    icon={ShoppingBag}
    trend={{ value: "+8.1%", isPositive: true }}
  />

            <StatCard
    title="Total Products"
    value={totalProductsCount}
    subtext="Low Stock:"
    subtextHighlight={String(lowStockCount)}
    icon={Glasses}
  />

            <StatCard
    title="Registered Customers"
    value={totalCustomersCount}
    subtext="Active buyer accounts"
    icon={Users}
    trend={{ value: "+12 new", isPositive: true }}
  />
          </div>

          {
    /* Sales Chart Section */
  }
          <div className="grid grid-cols-1 gap-8">
            <SalesChart
    weeklyData={weeklyData}
    monthlyData={monthlyData}
  />
          </div>

          {
    /* Recent Orders Section */
  }
          <div>
            <RecentOrders orders={orders} />
          </div>
        </div>}
    </PageContainer>;
};
var stdin_default = Dashboard;
export {
  Dashboard,
  stdin_default as default
};
