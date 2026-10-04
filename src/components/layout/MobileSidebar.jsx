import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { navigationItems } from "../../config/navigation";
import { useAuth } from "../../hooks/useAuth";
import { BrandLogo } from "../common/BrandLogo";

const MobileSidebar = ({ isOpen, onClose }) => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#14232E]/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-[#14232E] text-slate-200 shadow-2xl z-10 border-r border-[#1E3545] animate-in slide-in-from-left duration-200">
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#1E3545]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-white px-2 py-1 rounded-xl shadow-xs">
              <BrandLogo size="xs" className="h-6" />
            </div>
            <span className="font-bold text-white text-sm tracking-wide">
              THE LENS HUT
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E3545] cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#E4232C]/15 text-[#E4232C] border-l-4 border-[#E4232C] pl-2.5 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-[#1E3545]/60"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1E3545] bg-[#0E1922]">
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            {admin?.avatarUrl ? (
              <img
                src={admin.avatarUrl}
                alt={admin.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E4232C]/40"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1E3545] flex items-center justify-center text-sm font-bold text-[#E4232C]">
                {admin?.name?.charAt(0) || "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {admin?.name || "Administrator"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {admin?.email || "admin@thelenshut.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1E3545] bg-[#1E3545]/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-rose-900/30 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { MobileSidebar };
