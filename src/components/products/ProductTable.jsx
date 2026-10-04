import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Table } from "../common/Table";
import { StockBadge } from "./StockBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { ConfirmDialog } from "../common/ConfirmDialog";
const ProductTable = ({
  products,
  onDeleteProduct,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(productToDelete.id);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };
  const columns = [
    {
      header: "Image",
      className: "w-16",
      render: (product) => <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          <img
        src={product.images.front}
        alt={product.name}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.target.src = "https://placehold.co/100x100?text=Lens+Hut";
        }}
      />
        </div>
    },
    {
      header: "Product Name",
      className: "max-w-xs",
      render: (product) => <div>
          <div className="font-semibold text-slate-900 truncate">{product.name}</div>
          <div className="text-xs text-slate-400 font-medium">{product.brand}</div>
        </div>
    },
    {
      header: "SKU",
      accessor: "sku",
      className: "font-mono text-xs text-slate-600 whitespace-nowrap"
    },
    {
      header: "Category",
      render: (product) => <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
          {product.category}
        </span>
    },
    {
      header: "Gender",
      accessor: "gender",
      className: "text-xs text-slate-600"
    },
    {
      header: "Price",
      render: (product) => <div>
          <span className="font-semibold text-slate-900">
            {formatCurrency(product.offerPrice || product.price)}
          </span>
          {product.offerPrice && product.offerPrice < product.price && <span className="ml-1.5 text-xs text-slate-400 line-through">
              {formatCurrency(product.price)}
            </span>}
        </div>
    },
    {
      header: "Stock",
      render: (product) => <StockBadge stock={product.stock} />
    },
    {
      header: "Status",
      render: (product) => <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${product.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}
      >
          {product.status === "active" ? "Active" : "Inactive"}
        </span>
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (product) => <div className="flex items-center justify-end gap-1.5">
          <button
        type="button"
        onClick={() => navigate(`/products/${product.id}`)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="View product"
        title="View Details"
      >
            <Eye className="w-4 h-4" />
          </button>

          <button
        type="button"
        onClick={() => navigate(`/products/${product.id}/edit`)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Edit product"
        title="Edit Product"
      >
            <Edit className="w-4 h-4" />
          </button>

          <button
        type="button"
        onClick={() => setProductToDelete(product)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        aria-label="Delete product"
        title="Delete Product"
      >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
    }
  ];
  return <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <Table
    columns={columns}
    data={products}
    keyExtractor={(item) => item.id}
    isLoading={isLoading}
  />
      </div>

      <ConfirmDialog
    isOpen={!!productToDelete}
    onClose={() => setProductToDelete(null)}
    onConfirm={handleConfirmDelete}
    title="Delete Product"
    message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
    confirmLabel="Delete Product"
    cancelLabel="Cancel"
    variant="danger"
    isLoading={isDeleting}
  />
    </>;
};
export {
  ProductTable
};
