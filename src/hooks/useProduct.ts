import { useEffect, useState } from "react";
import { Product } from "../types/product";

export function useProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://dummyjson.com/products?limit=100");
      const result = await res.json();
      const products = result.products.map((p: any) => ({
        id: p.id.toString(),
        name: p.title,
        category: p.category,
        price: p.price,
        inStock: true,
      }));
      setData(products);
      setError("");
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      const res = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const result = await res.json();
      const added = {
        ...newProduct,
        id: result.id.toString(),
      };
      setData((prev) => [...prev, added]);
    } catch {
      setError("Add failed");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Delete failed");
    }
  };

  const updateProduct = async (updated: Product) => {
    try {
      await fetch(`https://dummyjson.com/products/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setData((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    } catch {
      setError("Update failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    setData,
    loading,
    error,
    fetchData,
    addProduct,
    deleteProduct,
    updateProduct, 
  };
}
