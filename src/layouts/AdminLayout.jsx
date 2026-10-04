import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { MobileSidebar } from "../components/layout/MobileSidebar";
const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <div className="flex min-h-screen bg-[#FAFAFA]">
      {
    /* Desktop Sidebar */
  }
      <Sidebar />

      {
    /* Mobile Drawer */
  }
      <MobileSidebar
    isOpen={mobileMenuOpen}
    onClose={() => setMobileMenuOpen(false)}
  />

      {
    /* Main Area */
  }
      <div className="flex flex-1 flex-col min-w-0">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>;
};
var stdin_default = AdminLayout;
export {
  AdminLayout,
  stdin_default as default
};
