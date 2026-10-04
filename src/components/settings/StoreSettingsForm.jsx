import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
const StoreSettingsForm = ({
  initialData,
  onSave
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: initialData
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await onSave({
        ...data,
        freeShippingMinimum: Number(data.freeShippingMinimum),
        standardShippingFee: Number(data.standardShippingFee)
      });
      toast.success("Store settings saved successfully");
    } catch {
      toast.error("Failed to save store settings");
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Store Settings</h2>
        <p className="text-xs text-slate-500">
          Configure customer support lines, dispatch address, and shipping thresholds
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
    label="Store Brand Name"
    placeholder="The Lens Hut"
    required
    error={errors.storeName?.message}
    {...register("storeName", { required: "Store name is required" })}
  />

          <Input
    label="Customer Support Email"
    type="email"
    placeholder="contact@thelenshut.com"
    required
    error={errors.storeEmail?.message}
    {...register("storeEmail", { required: "Store email is required" })}
  />

          <Input
    label="Support Phone Number"
    placeholder="+91 98765 43210"
    required
    error={errors.storePhone?.message}
    {...register("storePhone", { required: "Phone is required" })}
  />

          <Input
    type="number"
    label="Free Shipping Minimum Order (₹)"
    placeholder="999"
    required
    helperText="Orders above this amount qualify for ₹0 delivery"
    error={errors.freeShippingMinimum?.message}
    {...register("freeShippingMinimum", {
      required: "Free shipping minimum is required",
      valueAsNumber: true,
      min: { value: 0, message: "Cannot be negative" }
    })}
  />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Store & Dispatch Center Address
          </label>
          <textarea
    rows={2}
    className="block w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm py-2 px-3 transition-colors placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/10"
    placeholder="Physical address printed on shipping slips and invoices"
    {...register("storeAddress")}
  />
        </div>

        <div className="flex justify-end pt-4">
          <Button
    type="submit"
    variant="primary"
    isLoading={isLoading}
  >
            Save Changes
          </Button>
        </div>
      </form>
    </div>;
};
export {
  StoreSettingsForm
};
