import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Ticket, 
  Percent, 
  IndianRupee, 
  Calendar, 
  ShoppingCart, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const CouponForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      code: initialData?.code || "",
      discountType: initialData?.discountType || "Fixed Amount",
      discountValue: initialData?.discountValue ?? 200,
      minOrderAmount: initialData?.minOrderAmount ?? 999,
      startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
      expiryDate: initialData?.expiryDate || new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
      isActive: initialData?.isActive ?? true
    }
  });

  const selectedDiscountType = watch("discountType");
  const watchedCode = watch("code");
  const watchedDiscountValue = watch("discountValue");
  const watchedMinOrder = watch("minOrderAmount");
  const watchedStartDate = watch("startDate");
  const watchedExpiryDate = watch("expiryDate");
  const watchedIsActive = watch("isActive");

  const onFormSubmit = async (data) => {
    await onSubmit({
      code: data.code.toUpperCase().trim(),
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minOrderAmount: Number(data.minOrderAmount),
      startDate: data.startDate,
      expiryDate: data.expiryDate,
      isActive: Boolean(data.isActive)
    });
  };

  const previewCode = (watchedCode || "PROMOCODE").toUpperCase().trim();
  const previewValue = watchedDiscountValue || 0;
  const isPercentage = selectedDiscountType === "Percentage";

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Live Coupon Voucher Preview */}
      <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isPercentage 
                ? "bg-indigo-50 text-indigo-600 border border-indigo-100" 
                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
            }`}>
              {isPercentage ? <Percent className="w-6 h-6" /> : <IndianRupee className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base sm:text-lg font-black tracking-wider text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-xs">
                  {previewCode}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  watchedIsActive 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  {watchedIsActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isPercentage ? "Percentage Discount Voucher" : "Fixed Amount Cart Voucher"}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 w-full sm:w-auto">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {isPercentage ? `${previewValue}% OFF` : `${formatCurrency(previewValue || 0)} OFF`}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Min. spend: {formatCurrency(watchedMinOrder || 0)}
            </p>
          </div>
        </div>

        {/* Validity Footer in Preview */}
        <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Valid: {formatDate(watchedStartDate) || "Today"} → {formatDate(watchedExpiryDate) || "Future"}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Live Preview
          </span>
        </div>
      </div>

      {/* Section 1: Code & Discount Type */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 text-slate-400" />
          Coupon Identification
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Coupon Code"
            placeholder="e.g. FESTIVE20, LENS500"
            required
            helperText="Uppercase code customers will enter at checkout"
            error={errors.code?.message}
            {...register("code", { 
              required: "Coupon code is required",
              pattern: {
                value: /^[A-Za-z0-9_-]+$/,
                message: "Alphanumeric characters only, no spaces"
              }
            })}
          />

          <Select
            label="Discount Type"
            required
            options={[
              { value: "Fixed Amount", label: "Fixed Amount (₹ off)" },
              { value: "Percentage", label: "Percentage (% off)" }
            ]}
            helperText="Select flat reduction or percentage off"
            {...register("discountType")}
          />
        </div>
      </div>

      {/* Section 2: Values & Minimum Order Threshold */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
          Discount Value & Eligibility
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="number"
            label={selectedDiscountType === "Percentage" ? "Discount Percentage (%)" : "Discount Amount (₹)"}
            placeholder={selectedDiscountType === "Percentage" ? "20" : "500"}
            required
            helperText={
              selectedDiscountType === "Percentage" 
                ? "Percentage off cart total (e.g., 10% to 100%)" 
                : "Flat monetary discount applied to cart"
            }
            error={errors.discountValue?.message}
            {...register("discountValue", {
              required: "Discount value is required",
              min: { value: 1, message: "Must be greater than 0" },
              max: selectedDiscountType === "Percentage" 
                ? { value: 100, message: "Percentage cannot exceed 100%" } 
                : undefined,
              valueAsNumber: true
            })}
          />

          <Input
            type="number"
            label="Minimum Order Amount (₹)"
            placeholder="999"
            required
            helperText="Minimum cart subtotal needed to apply coupon"
            error={errors.minOrderAmount?.message}
            {...register("minOrderAmount", {
              required: "Minimum order amount is required",
              min: { value: 0, message: "Cannot be negative" },
              valueAsNumber: true
            })}
          />
        </div>
      </div>

      {/* Section 3: Validity Schedule */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Validity Window
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            required
            helperText="Coupon becomes usable on this date"
            error={errors.startDate?.message}
            {...register("startDate", { required: "Start date is required" })}
          />

          <Input
            type="date"
            label="Expiry Date"
            required
            helperText="Coupon automatically expires after this date"
            error={errors.expiryDate?.message}
            {...register("expiryDate", { 
              required: "Expiry date is required",
              validate: (val) => {
                const start = watch("startDate");
                if (start && val && val < start) {
                  return "Expiry date cannot be before start date";
                }
                return true;
              }
            })}
          />
        </div>
      </div>

      {/* Section 4: Activation Status */}
      <div className="pt-2">
        <label className="relative flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer select-none">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="h-4.5 w-4.5 rounded border-slate-300 text-[#14232E] focus:ring-[#14232E] cursor-pointer"
              {...register("isActive")}
            />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-slate-900 block text-sm">
              Activate coupon immediately
            </span>
            <span className="text-slate-500 mt-0.5 block">
              When checked, customers can immediately apply this promo code on the storefront.
            </span>
          </div>
        </label>
      </div>

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={!isLoading ? <CheckCircle2 className="w-4 h-4" /> : null}
        >
          {initialData ? "Save Changes" : "Create Coupon"}
        </Button>
      </div>
    </form>
  );
};

export { CouponForm };