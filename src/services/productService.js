import { initialMockProducts } from "../data/mockProducts";
const STORAGE_KEY = "thelenshut_products";
const loadProducts = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockProducts));
    return initialMockProducts;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialMockProducts;
  }
};
const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};
const productService = {
  getProducts: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return loadProducts();
  },
  getProductById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const products = loadProducts();
    const product = products.find((p) => p.id === id);
    return product || null;
  },
  createProduct: async (productData) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const products = loadProducts();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newProduct = {
      ...productData,
      id: `prod-${Date.now().toString(36)}`,
      createdAt: now,
      updatedAt: now
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
    return newProduct;
  },
  updateProduct: async (id, updates) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const products = loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const updatedProduct = {
      ...products[index],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    products[index] = updatedProduct;
    saveProducts(products);
    return updatedProduct;
  },
  deleteProduct: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const products = loadProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveProducts(filtered);
    return true;
  }
};
export {
  productService
};
