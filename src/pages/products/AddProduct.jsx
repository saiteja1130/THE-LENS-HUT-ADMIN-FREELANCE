import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProducts } from "../../hooks/useProducts";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { ProductForm } from "../../components/products/ProductForm";
const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addProduct(data);
      toast.success("Product added successfully");
      navigate("/products");
    } catch {
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <PageContainer className="max-w-4xl">
      <PageHeader
    title="Add Product"
    description="Introduce a new eyewear model, lens package, or optical accessory"
    backUrl="/products"
  />

      <ProductForm
    onSubmit={handleSubmit}
    isLoading={isSubmitting}
    mode="add"
  />
    </PageContainer>;
};
var stdin_default = AddProduct;
export {
  AddProduct,
  stdin_default as default
};
