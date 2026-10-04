const PRODUCT_CATEGORIES = [
  "Eyeglasses",
  "Sunglasses",
  "Contact Lenses",
  "Accessories"
];
const GENDERS = ["Men", "Women", "Unisex", "Kids"];
const FRAME_SHAPES = [
  "Round",
  "Rectangle",
  "Square",
  "Aviator",
  "Cat-Eye",
  "Oval",
  "Wayfarer",
  "Other"
];
const FRAME_TYPES = ["Full Rim", "Half Rim", "Rimless"];
const FRAME_MATERIALS = [
  "Titanium",
  "Acetate",
  "Metal",
  "TR90",
  "Other"
];
const FRAME_SIZES = ["Small", "Medium", "Large"];
const getStockStatus = (stock) => {
  if (stock === 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  return "In Stock";
};
const getStockBadgeColor = (stock) => {
  const status = getStockStatus(stock);
  switch (status) {
    case "In Stock":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500"
      };
    case "Low Stock":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500"
      };
    case "Out of Stock":
      return {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        dot: "bg-rose-500"
      };
  }
};
import { COLORS } from "../constants/colors";

export {
  COLORS,
  FRAME_MATERIALS,
  FRAME_SHAPES,
  FRAME_SIZES,
  FRAME_TYPES,
  GENDERS,
  PRODUCT_CATEGORIES,
  getStockBadgeColor,
  getStockStatus
};
