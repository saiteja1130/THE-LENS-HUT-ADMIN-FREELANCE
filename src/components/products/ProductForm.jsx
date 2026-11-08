import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, AlertCircle, ArrowRight } from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  GENDERS,
  FRAME_SHAPES,
  FRAME_TYPES,
  FRAME_MATERIALS,
  FRAME_SIZES
} from "../../utils/constants";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { ProductColorVariant } from "./ProductColorVariant";
import { CategoryConfigurationSection } from "./CategoryConfigurationSection";
import { LiveProductPreviewModal } from "./LiveProductPreviewModal";
import { categoryService } from "../../services/categoryService";

const ProductForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  mode = "add"
}) => {
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Categories fetched from backend database
  const [dbCategories, setDbCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let isMounted = true;
    categoryService.getCategories().then((cats) => {
      if (isMounted) {
        setDbCategories(cats || []);
        setLoadingCategories(false);
      }
    }).catch(() => {
      if (isMounted) setLoadingCategories(false);
    });
    return () => { isMounted = false; };
  }, []);

  // Normalize initial productType
  const initialProductType =
    initialData?.productType ||
    (initialData?.category === "Contact Lenses" || initialData?.category === "contact-lenses"
      ? "contact-lens"
      : initialData?.category === "Sunglasses"
      ? "sunglasses"
      : initialData?.category === "Accessories"
      ? "accessories"
      : "eyeglasses");

  const [productType, setProductType] = useState(initialProductType);

  // Colors start empty by default (no dummy Midnight Black)
  const [colors, setColors] = useState(initialData?.colors || []);

  // Category Configuration State - starts with no dummy optical packages or checked types
  const [categoryConfig, setCategoryConfig] = useState(() => {
    if (productType === "eyeglasses") {
      return (
        initialData?.eyeglassesConfig || {
          lensTypes: [],
          availableLenses: [],
          prescriptionConfig: {
            allowManual: false,
            allowUpload: false,
            requireAddForProgressive: false
          }
        }
      );
    }
    if (productType === "contact-lens") {
      return (
        initialData?.contactLensConfig || {
          powerType: "spherical",
          packSize: "6 Pieces / Box",
          piecesPerBox: 6,
          boxPricing: [
            { boxes: 1, price: 1699, label: "1 Box" },
            { boxes: 2, price: 3299, label: "2 Boxes (Save 5%)" },
            { boxes: 4, price: 6299, label: "4 Boxes (Save 10%)" }
          ],
          baseCurve: "8.6 mm",
          diameter: "14.2 mm",
          waterContent: "38%",
          disposability: "Monthly"
        }
      );
    }
    if (productType === "sunglasses") {
      return (
        initialData?.sunglassesConfig || {
          sunglassMode: "both",
          lensTypes: []
        }
      );
    }
    return {};
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      sku: initialData?.sku || `LH-${Math.floor(1e3 + Math.random() * 9e3)}`,
      brand: initialData?.brand || "",
      category: initialData?.category || "",
      gender: initialData?.gender || "",
      description: initialData?.description || "",
      price: initialData?.price !== void 0 ? initialData.price : "",
      offerPrice: initialData?.offerPrice || "",
      stock: initialData?.stock !== void 0 ? initialData.stock : "",
      status: initialData?.status || "active",
      shape: initialData?.frameSpecifications?.shape || "",
      frameType: initialData?.frameSpecifications?.frameType || "",
      material: initialData?.frameSpecifications?.material || "",
      size: initialData?.frameSpecifications?.size || ""
    }
  });

  const isFrameProduct = productType === "eyeglasses" || productType === "sunglasses";

  const handleProductTypeChange = (newType) => {
    setProductType(newType);
  };

  const onFormSubmit = async (data) => {
    if (dbCategories.length === 0) {
      toast.error("Please create at least one category before adding products.");
      return;
    }
    if (!data.category || !data.category.trim()) {
      toast.error("Please select a store category.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    if (data.sku) formData.append("sku", data.sku);
    formData.append("brand", data.brand || "");
    formData.append("productType", productType);
    formData.append("category", data.category);
    formData.append("gender", data.gender || "");
    formData.append("description", data.description || "");
    formData.append("price", Number(data.price));
    if (data.offerPrice) formData.append("offerPrice", Number(data.offerPrice));
    formData.append("stock", Number(data.stock));
    formData.append("status", data.status || "active");

    // Manage product images through the primary color variant
    const primaryImages = colors[0]?.images || { front: "", side: "", angle: "" };
    formData.append("images", JSON.stringify(primaryImages));
    if (primaryImages.front) formData.append("front", primaryImages.front);
    if (primaryImages.side) formData.append("side", primaryImages.side);
    if (primaryImages.angle) formData.append("angle", primaryImages.angle);

    // Append complex configuration objects
    formData.append("colors", JSON.stringify(colors));
    if (productType === "eyeglasses" && categoryConfig) {
      formData.append("eyeglassesConfig", JSON.stringify(categoryConfig));
    } else if (productType === "contact-lens" && categoryConfig) {
      formData.append("contactLensConfig", JSON.stringify(categoryConfig));
    } else if (productType === "sunglasses" && categoryConfig) {
      formData.append("sunglassesConfig", JSON.stringify(categoryConfig));
    }

    if (isFrameProduct) {
      formData.append(
        "frameSpecifications",
        JSON.stringify({
          shape: data.shape || "",
          frameType: data.frameType || "",
          material: data.material || "",
          size: data.size || ""
        })
      );
    }

    await onSubmit(formData);
  };

  const watchedFormData = watch();

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* 1. Product Category Card with Category Validation */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Product Category
              </h2>
              <p className="text-xs text-slate-500">
                Assign product to a store category
              </p>
            </div>
            {dbCategories.length > 0 && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                {dbCategories.length} {dbCategories.length === 1 ? 'Category' : 'Categories'} Available
              </span>
            )}
          </div>

          {!loadingCategories && dbCategories.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3.5 text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <p className="text-sm font-bold">No Categories Found in Store</p>
                <p className="text-xs text-amber-700">
                  You cannot add products until at least one store category has been added. Please create a category first to proceed.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Create Category <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Store Category <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={loadingCategories || dbCategories.length === 0}
                className={`block w-full rounded-lg border bg-white text-slate-900 text-sm py-2 px-3 transition-colors focus:outline-none focus:ring-2 cursor-pointer ${
                  errors.category
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                    : "border-slate-300 focus:border-[#E4232C] focus:ring-[#E4232C]/20"
                }`}
                {...register("category", { required: "Please select a store category" })}
                onChange={(e) => {
                  const selectedCatName = e.target.value;
                  setValue("category", selectedCatName, { shouldValidate: true });
                  const lower = selectedCatName.toLowerCase();
                  if (lower.includes("contact")) {
                    handleProductTypeChange("contact-lens");
                  } else if (lower.includes("sunglass")) {
                    handleProductTypeChange("sunglasses");
                  } else if (lower.includes("access") || lower.includes("cloth") || lower.includes("case")) {
                    handleProductTypeChange("accessories");
                  } else {
                    handleProductTypeChange("eyeglasses");
                  }
                }}
              >
                <option value="">
                  {loadingCategories ? "Loading categories..." : "Select Category *"}
                </option>
                {dbCategories.map((cat) => (
                  <option key={cat.id || cat._id || cat.slug} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-rose-600">{errors.category.message}</p>
              )}
            </div>
          )}
        </div>

        {/* 2. Basic Details Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Basic Details</h2>
            <p className="text-xs text-slate-500">Essential product information and categorization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              placeholder="e.g. Lumina Round Titanium"
              required
              error={errors.name?.message}
              {...register("name", { required: "Product name is required" })}
            />

            <Input
              label="SKU (Stock Keeping Unit)"
              placeholder="e.g. VC-E1140-BLK"
              required
              error={errors.sku?.message}
              {...register("sku", { required: "SKU is required" })}
            />

            <Input
              label="Brand Name"
              placeholder="e.g. The Lens Hut Reserve, Ray-Ban"
              required
              error={errors.brand?.message}
              {...register("brand", { required: "Brand name is required" })}
            />

            <Select
              label="Target Gender"
              options={[
                { value: "", label: "Select Gender" },
                ...GENDERS.map((g) => ({ value: g, label: g }))
              ]}
              required
              error={errors.gender?.message}
              {...register("gender", { required: "Gender is required" })}
            />

            <Select
              label="Status"
              options={[
                { value: "active", label: "Active (Visible in Store)" },
                { value: "inactive", label: "Inactive (Hidden)" }
              ]}
              {...register("status")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Description
            </label>
            <textarea
              rows={3}
              className="block w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm py-2 px-3 transition-colors placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/10"
              placeholder="Detailed optical description..."
              {...register("description")}
            />
          </div>
        </div>

        {/* 3. Category Specific Configuration Engine Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {productType === "eyeglasses" && "Spectacle Lens & Rx Configuration"}
              {productType === "contact-lens" && "Contact Lens Pack & Power Parameters"}
              {productType === "sunglasses" && "Sunglasses Lens & Power Mode Settings"}
              {productType === "accessories" && "Accessory Details"}
            </h2>
            <p className="text-xs text-slate-500">
              Configure category-specific optical packages, powers, and pricing tiers
            </p>
          </div>

          <CategoryConfigurationSection
            productType={productType}
            configData={categoryConfig}
            onChange={setCategoryConfig}
          />
        </div>

        {/* 4. Frame Specifications (If Eyeglasses or Sunglasses) */}
        {isFrameProduct && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Frame Specifications</h2>
              <p className="text-xs text-slate-500">Optical dimensions and frame engineering specs</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Select
                label="Shape"
                options={[
                  { value: "", label: "Select Shape" },
                  ...FRAME_SHAPES.map((s) => ({ value: s, label: s }))
                ]}
                {...register("shape")}
              />

              <Select
                label="Frame Type"
                options={[
                  { value: "", label: "Select Frame Type" },
                  ...FRAME_TYPES.map((t) => ({ value: t, label: t }))
                ]}
                {...register("frameType")}
              />

              <Select
                label="Material"
                options={[
                  { value: "", label: "Select Material" },
                  ...FRAME_MATERIALS.map((m) => ({ value: m, label: m }))
                ]}
                {...register("material")}
              />

              <Select
                label="Size"
                options={[
                  { value: "", label: "Select Size" },
                  ...FRAME_SIZES.map((s) => ({ value: s, label: s }))
                ]}
                {...register("size")}
              />
            </div>
          </div>
        )}

        {/* 5. Pricing & Stock */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Base Retail Pricing & Inventory</h2>
            <p className="text-xs text-slate-500">Configure base unit prices and stock counts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              label="Base Price (₹)"
              placeholder="e.g. 2499"
              required
              error={errors.price?.message}
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
                valueAsNumber: true
              })}
            />

            <Input
              type="number"
              label="Offer / Sale Price (₹) (Optional)"
              placeholder="e.g. 1999"
              error={errors.offerPrice?.message}
              {...register("offerPrice", {
                min: { value: 0, message: "Offer price cannot be negative" },
                valueAsNumber: true
              })}
            />

            <Input
              type="number"
              label="Stock Quantity"
              placeholder="e.g. 15"
              required
              error={errors.stock?.message}
              {...register("stock", {
                required: "Stock quantity is required",
                min: { value: 0, message: "Stock cannot be negative" },
                valueAsNumber: true
              })}
            />
          </div>
        </div>

        {/* 6. Color Variants - manages colors and their multi-perspective images */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Product Colors / Variants</h2>
            <p className="text-xs text-slate-500">Provide color options and multi-angle imagery (Front, Side, Angle)</p>
          </div>
          <ProductColorVariant colors={colors} onChange={setColors} />
        </div>

        {/* Actions Bar with Live Preview */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            icon={<Eye size={15} />}
          >
            Preview Configuration UX
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading || (!loadingCategories && dbCategories.length === 0)}
            >
              {mode === "add" ? "Create Product" : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>

      {/* Live Preview Modal */}
      <LiveProductPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        productData={{
          ...watchedFormData,
          productType,
          colors,
          images: colors[0]?.images || { front: "", side: "", angle: "" },
          eyeglassesConfig: productType === "eyeglasses" ? categoryConfig : undefined,
          contactLensConfig: productType === "contact-lens" ? categoryConfig : undefined,
          sunglassesConfig: productType === "sunglasses" ? categoryConfig : undefined
        }}
      />
    </>
  );
};

export { ProductForm };
