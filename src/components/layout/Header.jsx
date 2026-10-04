import { Menu, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { BrandLogo } from "../common/BrandLogo";

const Header = ({ onOpenMobileMenu }) => {
  const { admin } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-xs px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center">
          <BrandLogo size="xs" className="h-6" />
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span>The Lens Hut • Online Store Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick status pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E4232C]" />
          <span>Admin Portal</span>
        </div>

        {/* Notifications Icon (clean indicator) */}
        <div className="relative">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E4232C]" />
          </button>
        </div>

        {/* Admin profile snippet */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          {admin?.avatarUrl ? (
            <img
              src={admin.avatarUrl}
              alt={admin.name}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14232E] text-xs font-bold text-[#E4232C]">
              {admin?.name?.charAt(0) || "A"}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {admin?.name || "Admin"}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">Store Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
