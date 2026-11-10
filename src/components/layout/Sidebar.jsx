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
      <div className="flex h-16 items-center px-5 border-b border-[#1E3545] gap-3">
        <div className="flex items-center justify-center bg-white px-2 py-1 rounded-lg shadow-xs border border-white/20 shrink-0">
          <BrandLogo size="xs" className="h-6" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-white text-sm tracking-wider leading-tight truncate">
            THE LENS HUT
          </div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
            Admin Workspace
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-linear-to-r from-[#E4232C]/15 to-transparent text-white font-semibold border-l-[3px] border-[#E4232C] pl-2.5 shadow-2xs"
                    : "text-slate-400 hover:text-white hover:bg-[#1E3545]/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 transition-all ${
                      isActive
                        ? "text-[#E4232C]"
                        : "text-slate-400 group-hover:text-slate-200 group-hover:scale-105"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin User Profile & Sign Out */}
      <div className="p-3.5 border-t border-[#1E3545] bg-[#0E1922]/90">
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-[#14232E]/60 border border-[#1E3545]/60">
          {admin?.avatarUrl ? (
            <img
              src={admin.avatarUrl}
              alt={admin.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E4232C]/40 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1E3545] border border-slate-700/60 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {admin?.name?.charAt(0) || "A"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate leading-tight">
              {admin?.name || "Administrator"}
            </p>
            <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
              {admin?.email || "admin@thelenshut.com"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1E3545] bg-[#14232E] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-900/50 transition-all cursor-pointer shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export { Sidebar };
