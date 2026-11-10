import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Glasses } from "lucide-react";
import { Table } from "../common/Table";
import { StockBadge } from "./StockBadge";
import { formatCurrency } from "../../utils/formatCurrency";

const ProductTable = ({
  products = [],
  onDeleteProduct,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      header: "Product",
      className: "w-72 min-w-[240px]",
      render: (product) => {
        const imageSrc = product.images?.front || product.primaryImage || "";
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50 p-0.5 shadow-2xs">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <Glasses className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => navigate(`/products/${product.id}`)}
                className="text-left font-semibold text-slate-900 hover:text-[#E4232C] transition-colors truncate block max-w-xs cursor-pointer text-sm"
              >
                {product.name}
              </button>
              <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {product.brand || "Lens Hut"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "SKU",
      className: "whitespace-nowrap",
      render: (product) => (
        <span className="inline-block rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
          {product.sku || "N/A"}
        </span>
      ),
    },
    {
      header: "Category",
      className: "whitespace-nowrap",
      render: (product) => (
        <span className="inline-flex items-center rounded-full border border-slate-200/60 bg-slate-100/80 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {product.category}
        </span>
      ),
    },
    {
      header: "Gender",
      className: "whitespace-nowrap text-xs font-medium text-slate-600",
      accessor: "gender",
    },
    {
      header: "Price",
      className: "whitespace-nowrap",
      render: (product) => (
        <div>
          <span className="font-semibold text-slate-900 tabular-nums">
            {formatCurrency(product.offerPrice || product.price)}
          </span>
          {product.offerPrice && product.offerPrice < product.price && (
            <span className="ml-1.5 text-xs text-slate-400 line-through tabular-nums">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Stock",
      className: "whitespace-nowrap",
      render: (product) => <StockBadge stock={product.stock} />,
    },
    {
      header: "Status",
      className: "whitespace-nowrap",
      render: (product) => {
        const isActive = product.status === "active";
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-2xs ${
              isActive
                ? "border-emerald-200/70 bg-emerald-50 text-emerald-700"
                : "border-slate-200/70 bg-slate-100 text-slate-600"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                isActive ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            <span>{isActive ? "Active" : "Inactive"}</span>
          </span>
        );
      },
    },
    {
      header: "Actions",
      className: "text-right whitespace-nowrap",
      headerClassName: "text-right",
      render: (product) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => navigate(`/products/${product.id}`)}
            className="rounded-lg border border-transparent p-1.5 text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-2xs"
            aria-label="View product"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => navigate(`/products/${product.id}/edit`)}
            className="rounded-lg border border-transparent p-1.5 text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-2xs"
            aria-label="Edit product"
            title="Edit Product"
          >
            <Edit className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteProduct && onDeleteProduct(product)}
            className="rounded-lg border border-transparent p-1.5 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer shadow-2xs"
            aria-label="Delete product"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-t-xl border border-slate-200/80 bg-white shadow-xs">
      <Table
        columns={columns}
        data={products}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
      />
    </div>
  );
};

export { ProductTable };
