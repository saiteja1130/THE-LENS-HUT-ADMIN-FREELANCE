import { useContext } from "react";
import { BannerContext } from "../contexts/BannerContext";
const useBanners = () => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error("useBanners must be used within a BannerProvider");
  }
  return context;
};
export {
  useBanners
};
