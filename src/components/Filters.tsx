import "./Filters.css";

type Props = {
  category: string;
  inStockOnly: boolean;
  onCategoryChange: (value: string) => void;
  onInStockChange: (value: boolean) => void;
};

const Filters = ({
  category,
  inStockOnly,
  onCategoryChange,
  onInStockChange,
}: Props) => {
  return (
    <div className="filters">
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Home">Home</option>
        <option value="Books">Books</option>
        <option value="Sports">Sports</option>
      </select>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockChange(e.target.checked)}
        />
        In Stock Only
      </label>
    </div>
  );
};

export default Filters;
