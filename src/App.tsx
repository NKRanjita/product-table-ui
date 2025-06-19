import { useState, useEffect, useMemo } from "react";
import { useProducts } from "./hooks/useProduct";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import Pagination from "./components/Pagination";
import { Product } from "./types/product";
import "./App.css";

function App() {
  const {
    data = [],
    loading,
    error,
    fetchData,
    addProduct,
    deleteProduct,
    updateProduct,
  } = useProducts();

  const [category, setCategory] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const [message, setMessage] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000); // clear after 3 seconds
  };

  const filtered = useMemo(() => {
    return data.filter((p: Product) => {
      const matchCategory = category ? p.category === category : true;
      const matchStock = inStockOnly ? p.inStock : true;
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchStock && matchSearch;
    });
  }, [data, category, inStockOnly, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      sortAsc ? a.price - b.price : b.price - a.price
    );
  }, [filtered, sortAsc]);

  const paginated = useMemo(() => {
    return sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [sorted, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filtered.length / itemsPerPage);
  }, [filtered]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(data.map((p) => p.category)));
  }, [data]);

  const handleAdd = async (newProduct: Omit<Product, "id">) => {
    await addProduct(newProduct);
    setCurrentPage(1);
    showMessage("✅ Product added successfully.");
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setTimeout(() => {
      const newTotalPages = Math.ceil((filtered.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    }, 100);
    showMessage("🗑️ Product deleted successfully.");
  };

  const handleUpdate = async (updatedProduct: Product) => {
    await updateProduct(updatedProduct);
    showMessage("✏️ Product updated successfully.");
  };

  return (
    <div className="app-container">
      <h1>Product Table</h1>

      {message && <div className="message">{message}</div>}

      <div className="filters">
        <input
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <label>
          Category:
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            {uniqueCategories.map((cat) => (
              <option key={String(cat)} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setCurrentPage(1);
            }}
          />
          <span>In Stock Only</span>
        </label>

        <button
          className="sort-button"
          onClick={() => setSortAsc((prev) => !prev)}
        >
          Sort by Price {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      <ProductForm onAdd={handleAdd} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ProductTable
        products={paginated}
        loading={loading}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        sortAsc={sortAsc}
        onToggleSort={() => setSortAsc((prev) => !prev)}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default App;
