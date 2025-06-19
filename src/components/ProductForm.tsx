import { useState } from "react";
import "./Styles/ProductForm.css";

interface ProductFormProps {
  onAdd: (newProduct: {
    name: string;
    category: string;
    price: number;
    inStock: boolean;
  }) => void;
}

function ProductForm({ onAdd }: ProductFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newProduct = {
      name,
      category,
      price: parseFloat(price),
      inStock,
    };

    try {
      await onAdd(newProduct); // hook handles fetch + setData
      setName("");
      setCategory("");
      setPrice("");
      setInStock(true);
    } catch {
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>Add Product</h3>
     <input
  className="tall-input"
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>
<input
  className="tall-input"
  placeholder="Category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  required
/>

      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
        />
        In Stock
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}

export default ProductForm;
