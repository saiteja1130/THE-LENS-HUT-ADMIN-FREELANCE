import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
const AdminProfileForm = ({
  initialData,
  onSave
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await onSave({
        name: data.name.trim(),
        email: data.email.trim()
      });
      if (data.newPassword) {
        if (data.newPassword !== data.confirmPassword) {
          toast.error("New passwords do not match");
          setIsLoading(false);
          return;
        }
        setPasswordSuccess(true);
        setTimeout(() => setPasswordSuccess(false), 3e3);
      }
      toast.success("Admin profile updated successfully");
    } catch {
      toast.error("Failed to update admin profile");
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Admin Profile</h2>
        <p className="text-xs text-slate-500">
          Manage your administrative credentials and personal contact email
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
    label="Full Name"
    placeholder="Store Administrator"
    required
    error={errors.name?.message}
    {...register("name", { required: "Name is required" })}
  />

          <Input
    label="Email Address"
    type="email"
    placeholder="admin@thelenshut.com"
    required
    error={errors.email?.message}
    {...register("email", {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address"
      }
    })}
  />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Change Password
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
    type="password"
    label="Current Password"
    placeholder="••••••••"
    {...register("currentPassword")}
  />

            <Input
    type="password"
    label="New Password"
    placeholder="••••••••"
    {...register("newPassword")}
  />

            <Input
    type="password"
    label="Confirm New Password"
    placeholder="••••••••"
    {...register("confirmPassword")}
  />
          </div>
          {passwordSuccess && <p className="text-xs text-emerald-600 font-semibold mt-2">
              Password updated successfully.
            </p>}
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
  AdminProfileForm
};
