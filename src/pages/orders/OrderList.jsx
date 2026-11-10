import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { ShoppingBag } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { PageContainer } from "../../components/layout/PageContainer";
import { OrderFilters } from "../../components/orders/OrderFilters";
import { OrderTable } from "../../components/orders/OrderTable";
import { Pagination } from "../../components/common/Pagination";
import { EmptyState } from "../../components/common/EmptyState";

const OrderList = () => {
  const { orders, loading, updateOrderStatus } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const debouncedSearch = useDebounce(search, 250);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesId = order.orderNumber?.toLowerCase().includes(query);
        const customerName =
          order.customer?.name || order.shippingAddress?.fullName || "";
        const customerPhone =
          order.customer?.phone || order.shippingAddress?.phone || "";

        const matchesName = customerName.toLowerCase().includes(query);
        const matchesPhone = customerPhone.toLowerCase().includes(query);

        if (!matchesId && !matchesName && !matchesPhone) return false;
      }
      if (statusFilter !== "All" && order.orderStatus !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [orders, debouncedSearch, statusFilter]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    setPage,
  } = usePagination(filteredOrders, { initialPageSize: 8 });

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Orders
            </h1>
            {!loading && (
              <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Fulfillment tracking, optical prescription verification, and courier dispatches
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <OrderFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Main Order Content */}
      {!loading && filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="No customer orders matched your selected filters or search terms."
          icon={<ShoppingBag className="h-8 w-8 text-slate-400" />}
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <OrderTable
            orders={paginatedItems}
            onStatusChange={handleStatusChange}
            isLoading={loading}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      )}
    </PageContainer>
  );
};

export default OrderList;
export { OrderList };
