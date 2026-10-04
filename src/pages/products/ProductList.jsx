import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Glasses } from "lucide-react";
import { toast } from "react-toastify";
import { useProducts } from "../../hooks/useProducts";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { ProductFilters } from "../../components/products/ProductFilters";
import { ProductTable } from "../../components/products/ProductTable";
import { Pagination } from "../../components/common/Pagination";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";
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
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
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
    setPage
  } = usePagination(filteredProducts, { initialPageSize: 8 });
  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setStockStatus("All");
    setStatus("All");
    setSearchParams({});
  };
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    }
  };
  return <PageContainer>
      <PageHeader
    title="Products"
    description="Catalog management, optical specifications, pricing, and stock"
    actions={<Button
      variant="secondary"
      onClick={() => navigate("/products/add")}
      icon={<Plus className="w-4 h-4" />}
    >
            Add Product
          </Button>}
  />

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

      {!loading && filteredProducts.length === 0 ? <EmptyState
    title="No products found"
    description="No eyewear products matched your selected filters or search terms."
    icon={<Glasses className="w-8 h-8 text-slate-400" />}
    actionLabel="Add Product"
    onAction={() => navigate("/products/add")}
    secondaryActionLabel="Clear Filters"
    onSecondaryAction={handleClearFilters}
  /> : <div className="space-y-0">
          <ProductTable
    products={paginatedItems}
    onDeleteProduct={handleDeleteProduct}
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
var stdin_default = ProductList;
export {
  ProductList,
  stdin_default as default
};
