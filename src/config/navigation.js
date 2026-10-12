import {
  LayoutDashboard,
  Glasses,
  Layers,
  ShoppingBag,
  Users,
  Ticket,
  Image,
  Settings
} from "lucide-react";
const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    exact: true
  },
  {
    label: "Products",
    path: "/products",
    icon: Glasses
  },
  {
    label: "Categories",
    path: "/categories",
    icon: Layers
  },
  {
    label: "Orders",
    path: "/orders",
    icon: ShoppingBag
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users
  },
  {
    label: "Coupons",
    path: "/coupons",
    icon: Ticket
  },
  {
    label: "Banners",
    path: "/banners",
    icon: Image
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings
  }
];
export {
  navigationItems
};
