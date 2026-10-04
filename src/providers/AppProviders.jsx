import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ProductProvider } from "../contexts/ProductContext";
import { OrderProvider } from "../contexts/OrderContext";
import { CustomerProvider } from "../contexts/CustomerContext";
import { CouponProvider } from "../contexts/CouponContext";
import { BannerProvider } from "../contexts/BannerContext";
import { SettingsProvider } from "../contexts/SettingsContext";
const AppProviders = ({ children }) => {
  return <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <CustomerProvider>
            <CouponProvider>
              <BannerProvider>
                <SettingsProvider>
                  {children}
                  <ToastContainer
    position="top-right"
    autoClose={3e3}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    theme="light"
  />
                </SettingsProvider>
              </BannerProvider>
            </CouponProvider>
          </CustomerProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>;
};
export {
  AppProviders
};
