import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { navigationItems } from "../../config/navigation";
import { useAuth } from "../../hooks/useAuth";
import { BrandLogo } from "../common/BrandLogo";

const Sidebar = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-[#14232E] text-slate-200 border-r border-[#1E3545] shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b border-[#1E3545] gap-3">
        <div className="flex items-center justify-center bg-white px-2.5 py-1.5 rounded-xl shadow-xs border border-white/20">
          <BrandLogo size="sm" className="h-6" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-white text-sm tracking-wide leading-tight truncate">
            THE LENS HUT
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Admin Workspace
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Main Navigation
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-[#E4232C]/15 text-[#E4232C] border-l-4 border-[#E4232C] font-semibold pl-2.5 shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-[#1E3545]/60"
                }`
              }
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Admin User & Logout */}
      <div className="p-4 border-t border-[#1E3545] bg-[#0E1922]">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
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
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1E3545] bg-[#1E3545]/60 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-900/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export { Sidebar };
