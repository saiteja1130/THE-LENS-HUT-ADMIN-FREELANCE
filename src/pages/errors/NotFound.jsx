import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "../../components/common/Button";
import { BrandLogo } from "../../components/common/BrandLogo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 text-center">
      <div className="flex items-center justify-center p-3 rounded-2xl bg-white shadow-xl mb-6 border border-slate-200">
        <BrandLogo size="lg" className="h-10" />
      </div>

      <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-2">
        Page Not Found
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
        The requested admin route does not exist or has been relocated.
      </p>

      <div className="mt-6">
        <Button
          variant="primary"
          onClick={() => navigate("/dashboard")}
          icon={<Home className="w-4 h-4" />}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export { NotFound };
export default NotFound;
