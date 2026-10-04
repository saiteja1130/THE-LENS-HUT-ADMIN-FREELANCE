import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Table } from "../common/Table";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { ConfirmDialog } from "../common/ConfirmDialog";
const CouponTable = ({
  coupons,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(couponToDelete.id);
    } finally {
      setIsDeleting(false);
      setCouponToDelete(null);
    }
  };
  const getCouponStatus = (coupon) => {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const isExpired = coupon.expiryDate < today;
    if (!coupon.isActive) {
      return {
        label: "Inactive",
        style: "bg-slate-100 text-slate-600 border-slate-200"
      };
    }
    if (isExpired) {
      return {
        label: "Expired",
        style: "bg-rose-50 text-rose-700 border-rose-200"
      };
    }
    return {
      label: "Active",
      style: "bg-emerald-50 text-emerald-700 border-emerald-200"
    };
  };
  const columns = [
    {
      header: "Coupon Code",
      render: (coupon) => <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md text-xs border border-slate-200 tracking-wider">
          {coupon.code}
        </span>
    },
    {
      header: "Discount Type",
      accessor: "discountType",
      className: "text-xs text-slate-700"
    },
    {
      header: "Value",
      render: (coupon) => <span className="font-bold text-slate-900 text-sm">
          {coupon.discountType === "Percentage" ? `${coupon.discountValue}% OFF` : `${formatCurrency(coupon.discountValue)} OFF`}
        </span>
    },
    {
      header: "Minimum Order",
      render: (coupon) => <span className="text-xs text-slate-600 font-medium">
          {formatCurrency(coupon.minOrderAmount)}
        </span>
    },
    {
      header: "Validity Period",
      render: (coupon) => <div className="text-xs text-slate-600">
          <span>{formatDate(coupon.startDate)}</span>
          <span className="text-slate-400 mx-1">→</span>
          <span className="font-medium text-slate-700">{formatDate(coupon.expiryDate)}</span>
        </div>
    },
    {
      header: "Uses",
      render: (coupon) => <span className="text-xs text-slate-500">{coupon.usageCount} times</span>
    },
    {
      header: "Status",
      render: (coupon) => {
        const { label, style } = getCouponStatus(coupon);
        return <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}
        >
            {label}
          </span>;
      }
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (coupon) => <div className="flex items-center justify-end gap-1.5">
          <button
        type="button"
        onClick={() => onEdit(coupon)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Edit coupon"
        title="Edit Coupon"
      >
            <Edit className="w-4 h-4" />
          </button>

          <button
        type="button"
        onClick={() => setCouponToDelete(coupon)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        aria-label="Delete coupon"
        title="Delete Coupon"
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
    data={coupons}
    keyExtractor={(item) => item.id}
    isLoading={isLoading}
  />
      </div>

      <ConfirmDialog
    isOpen={!!couponToDelete}
    onClose={() => setCouponToDelete(null)}
    onConfirm={handleConfirmDelete}
    title="Delete Coupon"
    message={`Are you sure you want to delete coupon "${couponToDelete?.code}"?`}
    confirmLabel="Delete Coupon"
    cancelLabel="Cancel"
    variant="danger"
    isLoading={isDeleting}
  />
    </>;
};
export {
  CouponTable
};
