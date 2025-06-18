import { useState } from "react";
import { Product } from "../types/product";
import "./Styles/ProductTable.css";

interface Props {
  products: Product[];
  loading: boolean;
  onDelete: (id: string) => void;
  onUpdate: (updatedProduct: Product) => void;
  sortAsc: boolean;
  onToggleSort: () => void;
}

function ProductTable({
  products,
  loading,
  onDelete,
  onUpdate,
  sortAsc,
  onToggleSort,
}: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});

  if (loading) {
    return (
      <div className="skeleton-table">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="skeleton-row" />
        ))}
      </div>
    );
  }

  const handleSave = () => {
    if (editId && editData.name && editData.category && editData.price !== undefined) {
      onUpdate({ ...(editData as Product), id: editId });
      setEditId(null);
      setEditData({});
    }
  };

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th onClick={onToggleSort} style={{ cursor: "pointer" }}>
            Price {sortAsc ? "↑" : "↓"}
          </th>
          <th>In Stock</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>
              {editId === p.id ? (
                <input
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              ) : (
                p.name
              )}
            </td>
            <td>
              {editId === p.id ? (
                <input
                  value={editData.category || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, category: e.target.value }))
                  }
                />
              ) : (
                p.category
              )}
            </td>
            <td>
              {editId === p.id ? (
                <input
                  type="number"
                  value={editData.price?.toString() || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value),
                    }))
                  }
                />
              ) : (
                `₹${p.price.toFixed(2)}`
              )}
            </td>
            <td>
              {editId === p.id ? (
                <input
                  type="checkbox"
                  checked={editData.inStock ?? false}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      inStock: e.target.checked,
                    }))
                  }
                />
              ) : p.inStock ? (
                "✅"
              ) : (
                "❌"
              )}
            </td>
            <td>
              {editId === p.id ? (
                <>
                  <button  className="save-btn" onClick={handleSave}>Save</button>
                  <button  className="cancel-btn" onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="edit-btn"
                    onClick={() => {
                      setEditId(p.id);
                      setEditData(p);
                    }}
                  >
                    Edit
                  </button>
                  <button className="delete-btn"
                    onClick={() => {
                      if (window.confirm("Delete this product?")) onDelete(p.id);
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
