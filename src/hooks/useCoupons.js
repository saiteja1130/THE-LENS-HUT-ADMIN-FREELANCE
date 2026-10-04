import { useContext } from "react";
import { CouponContext } from "../contexts/CouponContext";
const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupons must be used within a CouponProvider");
  }
  return context;
};
export {
  useCoupons
};
