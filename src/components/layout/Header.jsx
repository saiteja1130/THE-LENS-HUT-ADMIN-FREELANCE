import { Menu, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { BrandLogo } from "../common/BrandLogo";

const Header = ({ onOpenMobileMenu }) => {
  const { admin } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 shadow-2xs backdrop-blur-xs select-none">
      {/* Left Area: Mobile menu trigger, Mobile logo, Store Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden cursor-pointer shadow-2xs"
          aria-label="Open mobile menu"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        {/* Mobile Logo */}
        <div className="flex items-center lg:hidden pl-1">
          <BrandLogo size="xs" className="h-6" />
        </div>

        {/* Store Operational Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 border border-slate-200/60 text-xs font-medium text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="tracking-tight">
            The Lens Hut • <span className="text-emerald-700 font-semibold">Store Operational</span>
          </span>
        </div>
      </div>

      {/* Right Area: Admin badge, Notifications, User profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Admin Portal status badge */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 text-[#E4232C]" />
          <span>Admin Portal</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 cursor-pointer shadow-2xs"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#E4232C] ring-2 ring-white" />
        </button>

        {/* Admin profile snippet */}
        <div className="flex items-center gap-2.5 border-l border-slate-200/80 pl-2.5 sm:pl-3.5">
          {admin?.avatarUrl ? (
            <img
              src={admin.avatarUrl}
              alt={admin.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100 shadow-2xs shrink-0"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#14232E] text-xs font-bold text-white shadow-2xs border border-[#1E3545]">
              {admin?.name?.charAt(0) || "A"}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
              {admin?.name || "Admin"}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Store Manager
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
