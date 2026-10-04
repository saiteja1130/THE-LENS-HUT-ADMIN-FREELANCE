import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, Glasses, Package, Sun, Sparkles } from "lucide-react";
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
import { ProductImageUpload } from "./ProductImageUpload";
import { CategoryConfigurationSection } from "./CategoryConfigurationSection";
import { LiveProductPreviewModal } from "./LiveProductPreviewModal";

const ProductForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  mode = "add"
}) => {
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const [colors, setColors] = useState(
    initialData?.colors || [
      { id: "c1", name: "Midnight Black", hex: "#0f172a" }
    ]
  );

  const [images, setImages] = useState(
    initialData?.images || {
      front: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    }
  );

  // Category Configuration State
  const [categoryConfig, setCategoryConfig] = useState(() => {
    if (productType === "eyeglasses") {
      return (
        initialData?.eyeglassesConfig || {
          lensTypes: ["frame-only", "single-vision", "progressive"],
          availableLenses: [
            {
              id: "lens-1",
              name: "Anti-Glare Standard 1.56",
              price: 499,
              index: "1.56",
              coating: "Anti-Reflective & Scratch Resistant"
            },
            {
              id: "lens-2",
              name: "BlueCut Pro 1.60 High Index",
              price: 1199,
              index: "1.60",
              coating: "Blue Shield & Oleophobic Anti-Smudge"
            },
            {
              id: "lens-3",
              name: "Crizal Easy Pro 1.67",
              price: 2499,
              index: "1.67",
              coating: "Crizal Multi-Coating"
            }
          ],
          prescriptionConfig: {
            allowManual: true,
            allowUpload: true,
            requireAddForProgressive: true
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
          lensTypes: [
            { id: "sg-only", name: "Sunglass Only", price: 0, polarized: false },
            { id: "sg-polarized", name: "HD Polarized Tint", price: 999, polarized: true },
            { id: "sg-photochromic", name: "Photochromic Day-Night", price: 1699, polarized: false }
          ]
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
      brand: initialData?.brand || "The Lens Hut",
      category:
        initialData?.category ||
        (productType === "contact-lens"
          ? "Contact Lenses"
          : productType === "sunglasses"
          ? "Sunglasses"
          : "Eyeglasses"),
      gender: initialData?.gender || "Unisex",
      description: initialData?.description || "",
      price: initialData?.price || 1999,
      offerPrice: initialData?.offerPrice || void 0,
      stock: initialData?.stock !== void 0 ? initialData.stock : 15,
      status: initialData?.status || "active",
      shape: initialData?.frameSpecifications?.shape || "Rectangle",
      frameType: initialData?.frameSpecifications?.frameType || "Full Rim",
      material: initialData?.frameSpecifications?.material || "Acetate",
      size: initialData?.frameSpecifications?.size || "Medium"
    }
  });

  const isFrameProduct = productType === "eyeglasses" || productType === "sunglasses";

  const handleProductTypeChange = (newType) => {
    setProductType(newType);
    if (newType === "eyeglasses") {
      setValue("category", "Eyeglasses");
    } else if (newType === "contact-lens") {
      setValue("category", "Contact Lenses");
    } else if (newType === "sunglasses") {
      setValue("category", "Sunglasses");
    } else {
      setValue("category", "Accessories");
    }
  };

  const onFormSubmit = async (data) => {
    const payload = {
      name: data.name,
      sku: data.sku,
      brand: data.brand,
      productType,
      category: data.category,
      gender: data.gender,
      description: data.description,
      price: Number(data.price),
      offerPrice: data.offerPrice ? Number(data.offerPrice) : void 0,
      stock: Number(data.stock),
      status: data.status,
      images,
      colors,
      eyeglassesConfig: productType === "eyeglasses" ? categoryConfig : undefined,
      contactLensConfig: productType === "contact-lens" ? categoryConfig : undefined,
      sunglassesConfig: productType === "sunglasses" ? categoryConfig : undefined,
      frameSpecifications: isFrameProduct
        ? {
            shape: data.shape,
            frameType: data.frameType,
            material: data.material,
            size: data.size
          }
        : undefined
    };
    await onSubmit(payload);
  };

  const watchedFormData = watch();

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* 1. Category / Product Type Switcher Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Product Category & Type
            </h2>
            <p className="text-xs text-slate-500">
              Select product category to activate the specialized optical configuration engine
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "eyeglasses", label: "Eyeglasses", icon: Glasses, desc: "Spectacles & frames" },
              { id: "contact-lens", label: "Contact Lens", icon: Package, desc: "Daily / Monthly packs" },
              { id: "sunglasses", label: "Sunglasses", icon: Sun, desc: "Polarized & UV shades" },
              { id: "accessories", label: "Accessories", icon: Sparkles, desc: "Cases & cleaning cloths" }
            ].map((cat) => {
              const isSelected = productType === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleProductTypeChange(cat.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#E4232C] bg-rose-50/20 ring-1 ring-[#E4232C] shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={18} className={isSelected ? "text-[#E4232C]" : "text-slate-500"} />
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#E4232C]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{cat.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{cat.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
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
              {...register("brand", { required: "Brand is required" })}
            />

            <Select
              label="Target Gender"
              options={GENDERS.map((g) => ({ value: g, label: g }))}
              required
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
                options={FRAME_SHAPES.map((s) => ({ value: s, label: s }))}
                {...register("shape")}
              />

              <Select
                label="Frame Type"
                options={FRAME_TYPES.map((t) => ({ value: t, label: t }))}
                {...register("frameType")}
              />

              <Select
                label="Material"
                options={FRAME_MATERIALS.map((m) => ({ value: m, label: m }))}
                {...register("material")}
              />

              <Select
                label="Size"
                options={FRAME_SIZES.map((s) => ({ value: s, label: s }))}
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
              placeholder="2499"
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
              placeholder="1999"
              error={errors.offerPrice?.message}
              {...register("offerPrice", {
                min: { value: 0, message: "Offer price cannot be negative" },
                valueAsNumber: true
              })}
            />

            <Input
              type="number"
              label="Stock Quantity"
              placeholder="15"
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

        {/* 6. Color Variants */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Product Colors / Variants</h2>
            <p className="text-xs text-slate-500">Provide color options and corresponding hex tones</p>
          </div>
          <ProductColorVariant colors={colors} onChange={setColors} />
        </div>

        {/* 7. Product Images */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Product Images</h2>
            <p className="text-xs text-slate-500">Multi-angle photography</p>
          </div>
          <ProductImageUpload images={images} onChange={setImages} />
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

            <Button type="submit" variant="primary" isLoading={isLoading}>
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
          images,
          eyeglassesConfig: productType === "eyeglasses" ? categoryConfig : undefined,
          contactLensConfig: productType === "contact-lens" ? categoryConfig : undefined,
          sunglassesConfig: productType === "sunglasses" ? categoryConfig : undefined
        }}
      />
    </>
  );
};

export { ProductForm };
