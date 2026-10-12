import { createContext, useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";
const ProductContext = createContext(void 0);
const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const addProduct = async (productData) => {
    try {
      const created = await productService.createProduct(productData);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw err;
    }
  };
  const updateProduct = async (id, updates) => {
    try {
      const updated = await productService.updateProduct(id, updates);
      setProducts((prev) => prev.map((p) => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      throw err;
    }
  };
  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      throw err;
    }
  };
  const getProduct = (id) => {
    return products.find((p) => p.id === id || p._id === id);
  };
  return <ProductContext.Provider
    value={{
      products,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      refreshProducts: fetchProducts
    }}
  >
      {children}
    </ProductContext.Provider>;
};
export {
  ProductContext,
  ProductProvider
};
