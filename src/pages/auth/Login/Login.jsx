import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { BrandLogo } from "../../../components/common/BrandLogo";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "admin@thelenshut.com",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl bg-white shadow-xl shadow-black/25 mb-4 border border-white/20">
          <BrandLogo size="lg" className="h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          THE LENS HUT
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Admin Portal Authentication
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100">
        {errorMessage && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@thelenshut.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Valid email is required",
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
            })}
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-[#E4232C] focus:ring-[#E4232C]"
                {...register("rememberMe")}
              />
              <span className="text-xs text-slate-600 font-medium">Remember Me</span>
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-[#E4232C] hover:bg-[#C81E26] text-white font-semibold"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </div>
        </form>


      </div>
    </div>
  );
};

export { Login };
export default Login;
