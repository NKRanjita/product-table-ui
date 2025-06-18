import { useState, useEffect } from "react";
import { useProducts } from "./hooks/useProduct";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import Pagination from "./components/Pagination";

import "./App.css";



function App() {
  const {
    data,
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

  useEffect(() => {
    fetchData();
  }, []);

  const itemsPerPage = 10;

  const filtered = data.filter((p) => {
    const matchCategory = category ? p.category === category : true;
    const matchStock = inStockOnly ? p.inStock : true;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchStock && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) =>
    sortAsc ? a.price - b.price : b.price - a.price
  );

  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueCategories = Array.from(new Set(data.map((p) => p.category)));

  const handleAdd = async (newProduct: any) => {
    await addProduct(newProduct);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
  };

  const handleUpdate = async (updatedProduct: any) => {
    await updateProduct(updatedProduct);
  };

  return (
    <div className="app-container">
      <h1>Product Table</h1>

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

        <label>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setCurrentPage(1);
            }}
          />
          In Stock Only
        </label>
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
        totalPages={Math.ceil(filtered.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default App;