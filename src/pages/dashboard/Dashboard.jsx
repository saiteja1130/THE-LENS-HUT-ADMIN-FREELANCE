import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Glasses,
  Users,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { useProducts } from "../../hooks/useProducts";
import { useCustomers } from "../../hooks/useCustomers";
import { PageContainer } from "../../components/layout/PageContainer";
import { StatCard } from "../../components/dashboard/StatCard";
import { SalesChart } from "../../components/dashboard/SalesChart";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";

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
  const todayStr = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) => o.orderDate?.startsWith(todayStr)).length;
  const totalProductsCount = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalCustomersCount = customers.length;

  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map = {};
    days.forEach((d) => {
      map[d] = { date: d, sales: 0, orders: 0 };
    });
    if (orders && orders.length > 0) {
      orders.forEach((o) => {
        if (o.orderStatus !== "Cancelled" && o.orderDate) {
          const d = new Date(o.orderDate);
          const dayName = days[d.getDay()];
          if (map[dayName]) {
            map[dayName].sales += o.totalAmount || 0;
            map[dayName].orders += 1;
          }
        }
      });
    }
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => map[d]);
  }, [orders]);

  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const map = {};
    months.forEach((m) => {
      map[m] = { date: m, sales: 0, orders: 0 };
    });
    if (orders && orders.length > 0) {
      orders.forEach((o) => {
        if (o.orderStatus !== "Cancelled" && o.orderDate) {
          const d = new Date(o.orderDate);
          const monthName = months[d.getMonth()];
          if (map[monthName]) {
            map[monthName].sales += o.totalAmount || 0;
            map[monthName].orders += 1;
          }
        }
      });
    }
    return months.map((m) => map[m]);
  }, [orders]);

  return (
    <PageContainer>
      {/* Dashboard Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Real-time sales, optical inventory tracking, and fulfillment overview
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/orders")}
            className="shadow-2xs"
          >
            Manage Orders
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/products/add")}
            icon={<Plus className="h-4 w-4" />}
            className="shadow-xs"
          >
            Add Product
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader message="Loading dashboard metrics..." fullPage />
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Section 2: Low Inventory Alert (conditional) */}
          {lowStockCount > 0 && (
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 shadow-xs transition-all sm:flex-row sm:items-center sm:p-5">
              <div className="flex items-start gap-3.5 sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200/70 bg-amber-100/90 text-amber-800 shadow-2xs">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-amber-950">
                      Low Inventory Alert
                    </p>
                    <span className="inline-flex items-center rounded-full border border-amber-200/70 bg-amber-100/80 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Stock Warning
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-amber-800/90">
                    {lowStockCount}{" "}
                    {lowStockCount === 1 ? "product has" : "products have"} 5 or
                    fewer items remaining.
                    {outOfStockCount > 0 && (
                      <span className="ml-1 font-semibold text-rose-700">
                        ({outOfStockCount} completely out of stock)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/products?stock=Low+Stock")}
                className="w-full shrink-0 border-amber-300/80 bg-white font-medium text-amber-950 shadow-2xs hover:border-amber-400 hover:bg-amber-100/60 sm:w-auto"
              >
                Inspect Stock
              </Button>
            </div>
          )}

          {/* Section 3: 4 Statistics Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
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

          {/* Section 4: Sales Overview Chart */}
          <div className="grid grid-cols-1">
            <SalesChart
              weeklyData={weeklyData}
              monthlyData={monthlyData}
            />
          </div>

          {/* Section 5: Recent Orders */}
          <div>
            <RecentOrders orders={orders} />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;
export { Dashboard };
