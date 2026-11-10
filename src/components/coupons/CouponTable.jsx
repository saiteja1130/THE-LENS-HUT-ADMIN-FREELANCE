import { useState } from "react";
import { 
  Edit, 
  Trash2, 
  Copy, 
  Check, 
  Ticket, 
  Percent, 
  IndianRupee, 
  Calendar, 
  Users, 
  AlertCircle,
  Clock
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { toast } from "react-toastify";

const CouponTable = ({
  coupons = [],
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`, { autoClose: 2000 });
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const getCouponStatus = (coupon) => {
    const today = new Date().toISOString().split("T")[0];
    const isExpired = coupon.expiryDate < today;

    if (!coupon.isActive) {
      return {
        label: "Inactive",
        badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
        dotClass: "bg-slate-400"
      };
    }

    if (isExpired) {
      return {
        label: "Expired",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
        dotClass: "bg-rose-500"
      };
    }

    return {
      label: "Active",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotClass: "bg-emerald-500"
    };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 min-w-[700px]">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="py-3.5 px-4">Coupon Code</th>
              <th scope="col" className="py-3.5 px-4">Discount</th>
              <th scope="col" className="py-3.5 px-4">Min. Spend</th>
              <th scope="col" className="py-3.5 px-4">Validity Window</th>
              <th scope="col" className="py-3.5 px-4 text-center">Usage</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-6 w-28 bg-slate-200 rounded-md"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-24 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-16 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-36 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="h-5 w-12 bg-slate-200 rounded mx-auto"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-8 w-16 bg-slate-200 rounded-lg ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">No coupons found</p>
                  <p className="text-xs text-slate-400 mt-1">Create a new coupon to start offering discounts</p>
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => {
                const { label: statusLabel, badgeClass, dotClass } = getCouponStatus(coupon);
                const isPercentage = coupon.discountType === "Percentage";
                const isCopied = copiedCode === coupon.code;
                const today = new Date().toISOString().split("T")[0];
                const isExpired = coupon.expiryDate < today;

                return (
                  <tr
                    key={coupon.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Coupon Code & Quick Copy */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-md text-xs border border-slate-200 tracking-wider shadow-2xs transition-colors">
                          <Ticket className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{coupon.code}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(coupon.code, e)}
                          title="Copy coupon code"
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
                          isPercentage 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {isPercentage ? (
                            <>
                              <Percent className="w-3 h-3 mr-1" />
                              {coupon.discountValue}% OFF
                            </>
                          ) : (
                            <>
                              <IndianRupee className="w-3 h-3 mr-0.5" />
                              {formatCurrency(coupon.discountValue)} OFF
                            </>
                          )}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {isPercentage ? "Percentage off" : "Fixed reduction"}
                      </span>
                    </td>

                    {/* Minimum Order */}
                    <td className="py-4 px-4">
                      <div className="text-xs font-medium text-slate-700">
                        {coupon.minOrderAmount && coupon.minOrderAmount > 0 ? (
                          formatCurrency(coupon.minOrderAmount)
                        ) : (
                          <span className="text-slate-400">No minimum</span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">cart threshold</span>
                    </td>

                    {/* Validity Period */}
                    <td className="py-4 px-4">
                      <div className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="whitespace-nowrap">{formatDate(coupon.startDate)}</span>
                        <span className="text-slate-400">→</span>
                        <span className={`whitespace-nowrap font-medium ${isExpired ? "text-rose-600 font-semibold" : "text-slate-700"}`}>
                          {formatDate(coupon.expiryDate)}
                        </span>
                      </div>
                      {isExpired && (
                        <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" /> Expired voucher
                        </span>
                      )}
                    </td>

                    {/* Usage Count */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{coupon.usageCount || 0}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        redemptions
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                        {statusLabel}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
                          onClick={() => onDelete(coupon)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label="Delete coupon"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { CouponTable };