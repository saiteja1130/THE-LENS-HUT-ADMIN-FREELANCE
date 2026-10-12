import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Check } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { StockBadge } from "../../components/products/StockBadge";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProduct, loading } = useProducts();
  const product = productId ? getProduct(productId) : void 0;
  const [activeImageKey, setActiveImageKey] = useState("front");
  if (loading) {
    return <Loader message="Loading product profile..." fullPage />;
  }
  if (!product) {
    return <PageContainer>
        <ErrorMessage
      title="Product Not Found"
      message="Could not find the requested optical product."
      onRetry={() => navigate("/products")}
    />
      </PageContainer>;
  }
  const activeImage = product.images[activeImageKey] || product.images.front;
  return <PageContainer>
      <PageHeader
    title={product.name}
    description={`SKU: ${product.sku} \u2022 Brand: ${product.brand}`}
    backUrl="/products"
    actions={<Button
      variant="primary"
      onClick={() => navigate(`/products/${product.id}/edit`)}
      icon={<Edit className="w-4 h-4" />}
    >
            Edit Product
          </Button>}
  />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Perspectives (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs overflow-hidden">
            <div className="h-80 w-full rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300"
              />
            </div>

            {
    /* Thumbnail Pickers */
  }
            <div className="grid grid-cols-3 gap-3 mt-4">
              {["front", "side", "angle"].map((viewKey) => <button
    key={viewKey}
    type="button"
    onClick={() => setActiveImageKey(viewKey)}
    className={`h-20 rounded-lg overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer ${activeImageKey === viewKey ? "border-[#E4232C] ring-2 ring-[#E4232C]/20" : "border-slate-200 hover:border-slate-300"}`}
  >
                  <img
    src={product.images[viewKey]}
    alt={`${viewKey} perspective`}
    className="h-full w-full object-cover rounded"
  />
                </button>)}
            </div>
          </div>

          {
    /* Quick Metadata Box */
  }
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Record Created</span>
              <span className="font-medium text-slate-800">{formatDate(product.createdAt)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Last Updated</span>
              <span className="font-medium text-slate-800">{formatDate(product.updatedAt)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Catalog Visibility</span>
              <span
    className={`font-semibold ${product.status === "active" ? "text-emerald-600" : "text-slate-500"}`}
  >
                {product.status === "active" ? "Active in Store" : "Inactive (Hidden)"}
              </span>
            </div>
          </div>
        </div>

        {
    /* Right Column: Specifications & Pricing (7 cols) */
  }
        <div className="lg:col-span-7 space-y-6">
          {
    /* Price & Stock Card */
  }
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {product.category} • {product.gender}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {formatCurrency(product.offerPrice || product.price)}
                </h2>
                {product.offerPrice && product.offerPrice < product.price && <p className="text-xs text-slate-400 mt-0.5">
                    Regular MRP:{" "}
                    <span className="line-through">{formatCurrency(product.price)}</span>
                    <span className="ml-2 text-emerald-600 font-semibold">
                      Save {formatCurrency(product.price - product.offerPrice)}
                    </span>
                  </p>}
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block mb-1">Inventory Level</span>
                <StockBadge stock={product.stock} />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {product.description || "No detailed description provided for this product."}
              </p>
            </div>
          </div>

          {
    /* Frame Specifications */
  }
          {product.frameSpecifications && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Frame Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">
                    Shape
                  </span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {product.frameSpecifications.shape || "Standard"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">
                    Frame Type
                  </span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {product.frameSpecifications.frameType || "Full Rim"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">
                    Material
                  </span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {product.frameSpecifications.material || "Acetate"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">
                    Size
                  </span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {product.frameSpecifications.size || "Medium"}
                  </span>
                </div>
              </div>
            </div>}

          {
    /* Color Variants */
  }
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Color Variations ({product.colors.length})
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((color) => <div
    key={color.id}
    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs shadow-2xs"
  >
                  <span
    className="w-4 h-4 rounded-full border border-slate-300 shadow-inner shrink-0"
    style={{ backgroundColor: color.hex }}
  />
                  <span className="font-semibold text-slate-800">{color.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{color.hex}</span>
                </div>)}
            </div>
          </div>

          {
    /* Lens Compatibility */
  }
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Lens Tech & Optical Compatibility
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
    { label: "Zero Power (Plano)", active: product.lensCompatibility.zeroPower },
    { label: "Single Vision", active: product.lensCompatibility.singleVision },
    { label: "Progressive / Multifocal", active: product.lensCompatibility.progressive },
    { label: "Blue Light Block (Computer)", active: product.lensCompatibility.blueLightBlock },
    { label: "Sun Tint / Photochromic", active: product.lensCompatibility.sunTint }
  ].map((item, idx) => <div
    key={idx}
    className={`flex items-center gap-2.5 p-3 rounded-lg border ${item.active ? "border-emerald-200 bg-emerald-50/50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-400 opacity-60"}`}
  >
                  <div
    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.active ? "bg-emerald-600 text-white" : "bg-slate-300 text-white"}`}
  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>;
};
var stdin_default = ProductDetails;
export {
  ProductDetails,
  stdin_default as default
};
