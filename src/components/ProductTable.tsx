// Updated ProductTable.tsx with status message
import { useState } from "react";
import { Product } from "../types/product";
import "./Styles/ProductTable.css";

interface Props {
  products: Product[];
  loading: boolean;
  onDelete: (id: string) => void;
  onUpdate: (product: Product) => void;
  sortAsc: boolean;
  onToggleSort: () => void;
  statusMessage?: string | null;
}

function ProductTable({
  products,
  loading,
  onDelete,
  onUpdate,
  sortAsc,
  onToggleSort,
  statusMessage,
}: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Product>>({});

  if (loading) return <p>Loading...</p>;

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
        {statusMessage && (
          <tr>
            <td colSpan={5}>
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#e6ffed",
                  border: "1px solid #b2f2bb",
                  borderRadius: "4px",
                  color: "#2d7a2d",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {statusMessage}
              </div>
            </td>
          </tr>
        )}

        {products.map((p) => {
          const isEditing = p.id === editId;

          return (
            <tr key={p.id}>
              <td>
                {isEditing ? (
                  <input
                    value={editValues.name ?? p.name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                  />
                ) : (
                  p.name
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    value={editValues.category ?? p.category}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        category: e.target.value,
                      })
                    }
                  />
                ) : (
                  p.category
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="number"
                    value={editValues.price ?? p.price}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  `₹${p.price}`
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editValues.inStock ?? p.inStock}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        inStock: e.target.checked,
                      })
                    }
                  />
                ) : p.inStock ? (
                  "✅"
                ) : (
                  "❌"
                )}
              </td>
              <td>
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        onUpdate({
                          id: p.id,
                          name: editValues.name ?? p.name,
                          category: editValues.category ?? p.category,
                          price: editValues.price ?? p.price,
                          inStock: editValues.inStock ?? p.inStock,
                        });
                        setEditId(null);
                        setEditValues({});
                      }}
                      className="save-btn"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditValues({});
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(p.id);
                        setEditValues(p);
                      }}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ProductTable;
