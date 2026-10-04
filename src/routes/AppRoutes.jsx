import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductList from "../pages/products/ProductList";
import AddProduct from "../pages/products/AddProduct";
import EditProduct from "../pages/products/EditProduct";
import ProductDetails from "../pages/products/ProductDetails";
import OrderList from "../pages/orders/OrderList";
import OrderDetails from "../pages/orders/OrderDetails";
import CustomerList from "../pages/customers/CustomerList";
import CustomerDetails from "../pages/customers/CustomerDetails";
import CouponList from "../pages/coupons/CouponList";
import BannerList from "../pages/banners/BannerList";
import Settings from "../pages/settings/Settings";
import NotFound from "../pages/errors/NotFound";
const AppRoutes = () => {
  return <Routes>
      {
    /* Public Auth Routes */
  }
      <Route
    element={<PublicRoute>
            <AuthLayout />
          </PublicRoute>}
  >
        <Route path="/login" element={<Login />} />
      </Route>

      {
    /* Protected Admin Routes */
  }
      <Route
    element={<ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>}
  >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {
    /* Products */
  }
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/products/:productId/edit" element={<EditProduct />} />

        {
    /* Orders */
  }
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />

        {
    /* Customers */
  }
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/:customerId" element={<CustomerDetails />} />

        {
    /* Coupons */
  }
        <Route path="/coupons" element={<CouponList />} />

        {
    /* Banners */
  }
        <Route path="/banners" element={<BannerList />} />

        {
    /* Settings */
  }
        <Route path="/settings" element={<Settings />} />
      </Route>

      {
    /* 404 Route */
  }
      <Route path="*" element={<NotFound />} />
    </Routes>;
};
var stdin_default = AppRoutes;
export {
  AppRoutes,
  stdin_default as default
};
