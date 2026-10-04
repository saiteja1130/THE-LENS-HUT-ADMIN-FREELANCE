import { useForm } from "react-hook-form";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
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
      discountValue: initialData?.discountValue || 200,
      minOrderAmount: initialData?.minOrderAmount || 999,
      startDate: initialData?.startDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      expiryDate: initialData?.expiryDate || new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
      isActive: initialData?.isActive ?? true
    }
  });
  const selectedDiscountType = watch("discountType");
  const onFormSubmit = async (data) => {
    await onSubmit({
      code: data.code.toUpperCase().trim(),
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minOrderAmount: Number(data.minOrderAmount),
      startDate: data.startDate,
      expiryDate: data.expiryDate,
      isActive: data.isActive
    });
  };
  return <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
    label="Coupon Code"
    placeholder="e.g. LENS500, FESTIVE20"
    required
    error={errors.code?.message}
    {...register("code", { required: "Coupon code is required" })}
  />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
    label="Discount Type"
    options={[
      { value: "Fixed Amount", label: "Fixed Amount (\u20B9 off)" },
      { value: "Percentage", label: "Percentage (% off)" }
    ]}
    {...register("discountType")}
  />

        <Input
    type="number"
    label={selectedDiscountType === "Percentage" ? "Discount Percentage (%)" : "Discount Amount (\u20B9)"}
    placeholder={selectedDiscountType === "Percentage" ? "20" : "500"}
    required
    error={errors.discountValue?.message}
    {...register("discountValue", {
      required: "Discount value is required",
      min: { value: 1, message: "Must be greater than 0" },
      valueAsNumber: true
    })}
  />
      </div>

      <Input
    type="number"
    label="Minimum Order Amount (₹)"
    placeholder="999"
    required
    error={errors.minOrderAmount?.message}
    {...register("minOrderAmount", {
      required: "Minimum order amount is required",
      min: { value: 0, message: "Cannot be negative" },
      valueAsNumber: true
    })}
  />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
    type="date"
    label="Start Date"
    required
    {...register("startDate", { required: "Start date is required" })}
  />

        <Input
    type="date"
    label="Expiry Date"
    required
    {...register("expiryDate", { required: "Expiry date is required" })}
  />
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
    type="checkbox"
    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-800"
    {...register("isActive")}
  />
          <span className="text-sm font-medium text-slate-800">
            Activate coupon immediately
          </span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
  >
          {initialData ? "Save Changes" : "Create Coupon"}
        </Button>
      </div>
    </form>;
};
export {
  CouponForm
};
