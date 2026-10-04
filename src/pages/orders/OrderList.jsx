import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { ShoppingBag } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
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
        const matchesId = order.orderNumber.toLowerCase().includes(query);
        const matchesName = order.customer.name.toLowerCase().includes(query);
        const matchesPhone = order.customer.phone.toLowerCase().includes(query);
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
    setPage
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
  return <PageContainer>
      <PageHeader
    title="Orders"
    description="Fulfillment tracking, optical prescription verification, and courier dispatches"
  />

      <OrderFilters
    search={search}
    onSearchChange={setSearch}
    statusFilter={statusFilter}
    onStatusFilterChange={setStatusFilter}
    onClearFilters={handleClearFilters}
  />

      {!loading && filteredOrders.length === 0 ? <EmptyState
    title="No orders found"
    description="No customer orders matched your selected filters or search terms."
    icon={<ShoppingBag className="w-8 h-8 text-slate-400" />}
    actionLabel="Clear Filters"
    onAction={handleClearFilters}
  /> : <div className="space-y-0">
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
        </div>}
    </PageContainer>;
};
var stdin_default = OrderList;
export {
  OrderList,
  stdin_default as default
};
