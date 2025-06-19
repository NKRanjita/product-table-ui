import { useEffect, useState } from "react";
import { Product } from "../types/product";

const BASE_URL = "https://coding-test-pink.vercel.app/api/products";

export function useProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ✅ Fetch
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Fetch failed");
      const result = await res.json();
      const products = Array.isArray(result) ? result : result.products;
      setData(products || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add
  const addProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error("Add failed");
      await res.json();
      await fetchData(); // refresh data
    } catch (err) {
      console.error("Add error:", err);
      setError("Failed to add product");
    }
  };

  // ✅ Delete
  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      await res.json();
      setData((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete product");
    }
  };

const updateProduct = async (updated: Product) => {
  try {
    setData((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  } catch (err) {
    console.error("Update error:", err);
    setError("Failed to update product");
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
