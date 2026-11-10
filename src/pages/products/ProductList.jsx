import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Glasses } from "lucide-react";
import { toast } from "react-toastify";
import { useProducts } from "../../hooks/useProducts";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { PageContainer } from "../../components/layout/PageContainer";
import { ProductFilters } from "../../components/products/ProductFilters";
import { ProductTable } from "../../components/products/ProductTable";
import { Pagination } from "../../components/common/Pagination";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { getStockStatus } from "../../utils/constants";

const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, deleteProduct } = useProducts();

  const initialStock = searchParams.get("stock") || "All";
  const initialCat = searchParams.get("category") || "All";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCat);
  const [stockStatus, setStockStatus] = useState(initialStock);
  const [status, setStatus] = useState("All");

  const debouncedSearch = useDebounce(search, 250);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesSku = product.sku?.toLowerCase().includes(query);
        const matchesBrand = product.brand?.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesBrand) return false;
      }
      if (category !== "All" && product.category !== category) {
        return false;
      }
      if (stockStatus !== "All") {
        const pStockStatus = getStockStatus(product.stock);
        if (pStockStatus !== stockStatus) return false;
      }
      if (status !== "All" && product.status !== status) {
        return false;
      }
      return true;
    });
  }, [products, debouncedSearch, category, stockStatus, status]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    setPage,
  } = usePagination(filteredProducts, { initialPageSize: 8 });

  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setStockStatus("All");
    setStatus("All");
    setSearchParams({});
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const targetId =
        typeof productToDelete === "object" ? productToDelete.id : productToDelete;
      await deleteProduct(targetId);
      toast.success("Product deleted successfully");
      setProductToDelete(null);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>
            {!loading && (
              <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {products.length} {products.length === 1 ? "Product" : "Products"}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Catalog management, optical specifications, pricing, and stock
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate("/products/add")}
            icon={<Plus className="h-4 w-4" />}
            className="shadow-xs"
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Search and Filters Section */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        stockStatus={stockStatus}
        onStockStatusChange={setStockStatus}
        status={status}
        onStatusChange={setStatus}
        onClearFilters={handleClearFilters}
      />

      {/* Products Listing or Empty State */}
      {!loading && filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="No eyewear products matched your selected filters or search terms."
          icon={<Glasses className="h-8 w-8 text-slate-400" />}
          actionLabel="Add Product"
          onAction={() => navigate("/products/add")}
          secondaryActionLabel="Clear Filters"
          onSecondaryAction={handleClearFilters}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <ProductTable
            products={paginatedItems}
            onDeleteProduct={(prod) => setProductToDelete(prod)}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${
          typeof productToDelete === "object"
            ? productToDelete?.name
            : "this product"
        }"? This action cannot be undone and will remove it from all store catalogs.`}
        confirmLabel="Delete Product"
        isLoading={isDeleting}
        variant="danger"
      />
    </PageContainer>
  );
};

export default ProductList;
export { ProductList };
