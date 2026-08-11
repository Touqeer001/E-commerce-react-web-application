import SearchBar from "../Common/SearchBar";

export default function ProductFilters({
  search,
  onSearch,
  categories,
  categoryId,
  onCategoryChange,
}) {
  return (
    <div className="toolbar">
      <SearchBar
        placeholder="Search products"
        value={search}
        onChange={onSearch}
      />
      <select
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
    </div>
  );
}
