import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import { useCustomers } from "../../hooks/useCustomers";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { CustomerTable } from "../../components/customers/CustomerTable";
import { SearchInput } from "../../components/common/SearchInput";
import { Pagination } from "../../components/common/Pagination";
import { EmptyState } from "../../components/common/EmptyState";
const CustomerList = () => {
  const { customers, loading } = useCustomers();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const filteredCustomers = useMemo(() => {
    if (!debouncedSearch.trim()) return customers;
    const query = debouncedSearch.toLowerCase().trim();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query) || c.phone.toLowerCase().includes(query)
    );
  }, [customers, debouncedSearch]);
  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    setPage
  } = usePagination(filteredCustomers, { initialPageSize: 10 });
  return <PageContainer>
      <PageHeader
    title="Customers"
    description="Buyer directory, customer loyalty logs, and purchase activity"
  />

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:max-w-md">
          <SearchInput
    value={search}
    onChange={setSearch}
    placeholder="Search by customer name, email, or phone..."
  />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Registered: <strong className="text-slate-800">{customers.length}</strong>
        </div>
      </div>

      {!loading && filteredCustomers.length === 0 ? <EmptyState
    title="No customers found"
    description="No customer records matched your query."
    icon={<Users className="w-8 h-8 text-slate-400" />}
    actionLabel="Clear Search"
    onAction={() => setSearch("")}
  /> : <div className="space-y-0">
          <CustomerTable customers={paginatedItems} isLoading={loading} />
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
var stdin_default = CustomerList;
export {
  CustomerList,
  stdin_default as default
};
