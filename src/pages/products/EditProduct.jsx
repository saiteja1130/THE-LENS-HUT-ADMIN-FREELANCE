import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProducts } from "../../hooks/useProducts";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { ProductForm } from "../../components/products/ProductForm";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProduct, updateProduct, loading } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const product = productId ? getProduct(productId) : void 0;
  if (loading) {
    return <Loader message="Loading product data..." fullPage />;
  }
  if (!product) {
    return <PageContainer>
        <ErrorMessage
      title="Product Not Found"
      message={`The requested product with ID ${productId} does not exist.`}
      onRetry={() => navigate("/products")}
    />
      </PageContainer>;
  }
  const handleSubmit = async (data) => {
    if (!productId) return;
    setIsSubmitting(true);
    try {
      await updateProduct(productId, data);
      toast.success("Product updated successfully");
      navigate("/products");
    } catch {
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <PageContainer className="max-w-4xl">
      <PageHeader
    title={`Edit Product: ${product.name}`}
    description={`SKU: ${product.sku} \u2022 Update details, specifications, and inventory`}
    backUrl="/products"
  />

      <ProductForm
    initialData={product}
    onSubmit={handleSubmit}
    isLoading={isSubmitting}
    mode="edit"
  />
    </PageContainer>;
};
var stdin_default = EditProduct;
export {
  EditProduct,
  stdin_default as default
};
