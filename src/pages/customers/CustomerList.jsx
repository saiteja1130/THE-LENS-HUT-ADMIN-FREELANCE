import { useState, useMemo } from "react";
import { Users, RotateCcw } from "lucide-react";
import { useCustomers } from "../../hooks/useCustomers";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { PageContainer } from "../../components/layout/PageContainer";
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
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.phone?.toLowerCase().includes(query)
    );
  }, [customers, debouncedSearch]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    setPage,
  } = usePagination(filteredCustomers, { initialPageSize: 10 });

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Customers
            </h1>
            {!loading && (
              <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {customers.length}{" "}
                {customers.length === 1 ? "Customer" : "Customers"}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Buyer directory, customer loyalty logs, and purchase activity
          </p>
        </div>
      </div>

      {/* Search Bar & Total Registered Card */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by customer name, email, or phone..."
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200/80 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 shadow-2xs transition-colors hover:bg-rose-100 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear Search</span>
            </button>
          )}

          <div className="rounded-lg border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
            Total Registered:{" "}
            <strong className="font-bold text-slate-900">{customers.length}</strong>
          </div>
        </div>
      </div>

      {/* Main Listing or Empty State */}
      {!loading && filteredCustomers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="No customer records matched your query."
          icon={<Users className="h-8 w-8 text-slate-400" />}
          actionLabel="Clear Search"
          onAction={() => setSearch("")}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <CustomerTable customers={paginatedItems} isLoading={loading} />
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

export default CustomerList;
export { CustomerList };
